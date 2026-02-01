using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System.Text;
using taskmanager_reminders.Data;
using taskmanager_reminders.Models;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace taskmanager_reminders
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly IServiceProvider _serviceProvider;

        private const string RabbitMqHost = "localhost";
        private const string QueueName = "TaskReminders";

        public Worker(ILogger<Worker> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Worker started at: {time}", DateTimeOffset.Now);

            var factory = new ConnectionFactory() { HostName = RabbitMqHost };

            // 1. Create Connection and Channel
            await using var connection = await factory.CreateConnectionAsync(stoppingToken);
            await using var channel = await connection.CreateChannelAsync(cancellationToken: stoppingToken);

            // 2. Declare the Queue
            await channel.QueueDeclareAsync(
                queue: QueueName,
                durable: true,
                exclusive: false,
                autoDelete: false,
                arguments: null,
                cancellationToken: stoppingToken
            );

            // 3. Setup the Consumer (v7 syntax)
            var consumer = new AsyncEventingBasicConsumer(channel);

            // In v7, you assign the Task-returning delegate to Received
            consumer.ReceivedAsync += async (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);
                _logger.LogInformation("🐇 RabbitMQ Message Received: {message}", message);

                // Complete the task
                await Task.CompletedTask;
            };

            // Start consuming
            await channel.BasicConsumeAsync(
                queue: QueueName,
                autoAck: true,
                consumer: consumer,
                cancellationToken: stoppingToken
            );

            // 4. Main loop: check overdue tasks
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                    var now = DateTime.Now;

                    // Fetch tasks where DueDate is today or earlier and reminder hasn't been sent
                    var overdueTasks = await db.Tasks
                        .Where(t => !t.IsReminderSent && t.DueDate <= now)
                        .ToListAsync(stoppingToken);

                    foreach (var task in overdueTasks)
                    {
                        var message = $"Hi your Task is due {task.Title}";
                        var body = Encoding.UTF8.GetBytes(message);

                        // In v7, use BasicPublishAsync with Default Exchange ("")
                        await channel.BasicPublishAsync(
                            exchange: string.Empty,
                            routingKey: QueueName,
                            body: body,
                            cancellationToken: stoppingToken
                        );

                        _logger.LogInformation("✅ Sent reminder for Task: {taskId}", task.Id);

                        task.IsReminderSent = true;
                    }

                    if (overdueTasks.Any())
                    {
                        await db.SaveChangesAsync(stoppingToken);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "❌ Error processing overdue tasks");
                }

                // Check every 10 seconds
                await Task.Delay(10000, stoppingToken);
            }
        }
    }
}