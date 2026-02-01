using Microsoft.EntityFrameworkCore;
using taskmanager_reminders.Data;
using taskmanager_reminders;

var builder = Host.CreateApplicationBuilder(args);

// Add DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Worker
builder.Services.AddHostedService<Worker>();


var app = builder.Build();
app.Run();
