using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Interfaces;
using TaskManagerAPI.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace TaskManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskRepository _repository;
        private readonly IMapper _mapper;
        private readonly ILogger<TasksController> _logger;

        public TasksController(
            ITaskRepository repository,
            IMapper mapper,
            ILogger<TasksController> logger)
        {
            _repository = repository;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet("user/{userId:int}")]
        public async Task<ActionResult<IEnumerable<TaskDTO>>> GetByUser(int userId)
        {
            try
            {
                var tasks = await _repository.GetByUserIdAsync(userId);
                var result = _mapper.Map<IEnumerable<TaskDTO>>(tasks);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching tasks for user {UserId}", userId);
                return StatusCode(500, new { error = "An unexpected error occurred while fetching tasks." });
            }
        }

        [HttpPost]
        public async Task<ActionResult<TaskDTO>> Create([FromBody] TaskCreateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { error = "Missing Fields" });

            if (dto.DueDate < DateTime.UtcNow.Date)
                return BadRequest(new { error = "Due date cannot be in the past." });

            try
            {
                var entity = _mapper.Map<TaskEntity>(dto);
                var created = await _repository.AddAsync(entity);
                var taskDto = _mapper.Map<TaskDTO>(created);

                //return CreatedAtAction(nameof(GetByUser), new { userId = created.UserId }, taskDto);
                return Ok(taskDto);
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error creating task for user {UserId}", dto.UserId);
                return StatusCode(500, new { error = "Database error occurred while creating the task." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error creating task for user {UserId}", dto.UserId);
                return StatusCode(500, new { error = "Unexpected error occurred while creating the task." });
            }
        }

        [HttpPut("{id:int}/user/{userId:int}")]
        public async Task<ActionResult<TaskDTO>> Update(int id, int userId, [FromBody] TaskDTO taskDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (id != taskDto.Id || userId != taskDto.UserId)
                return BadRequest(new { error = "ID mismatch or invalid user." });

            if (taskDto.DueDate < DateTime.UtcNow.Date)
                return BadRequest(new { error = "Due date cannot be in the past." });

            try
            {
                var existing = await _repository.GetByIdAsync(id);
                if (existing == null || existing.UserId != userId)
                    return NotFound(new { error = "Task Not Found" });

                _mapper.Map(taskDto, existing);
                var updated = await _repository.UpdateAsync(existing);
                return Ok(_mapper.Map<TaskDTO>(updated));
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error updating task {TaskId} for user {UserId}", id, userId);
                return StatusCode(500, new { error = "Database error occurred while updating the task." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error updating task {TaskId} for user {UserId}", id, userId);
                return StatusCode(500, new { error = "Unexpected error occurred while updating the task." });
            }
        }

        [HttpDelete("{id:int}/user/{userId:int}")]
        public async Task<IActionResult> Delete(int id, int userId)
        {
            try
            {
                var task = await _repository.GetByIdAsync(id);
                if (task == null || task.UserId != userId)
                    return NotFound(new { error = "Task Not Found" });

                var deleted = await _repository.DeleteAsync(id);
                if (!deleted)
                return StatusCode(500, new { error = "Failed to delete the task." });

                _logger.LogInformation("Task deleted with id {TaskId} for user {UserId}", id, userId);
                return NoContent();
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error deleting task {TaskId} for user {UserId}", id, userId);
                return StatusCode(500, new { error = "Database error occurred while deleting the task." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error deleting task {TaskId} for user {UserId}", id, userId);
                return StatusCode(500, new { error = "Unexpected error occurred while deleting the task." });
            }
        }
    }
}
