using TaskManagerAPI.Models;

namespace TaskManagerAPI.Interfaces
{
    public interface ITaskRepository
    {
        Task<TaskEntity> GetByIdAsync(int id);
        Task<IEnumerable<TaskEntity>> GetByUserIdAsync(int userId);
        Task<TaskEntity> AddAsync(TaskEntity task);
        Task<TaskEntity> UpdateAsync(TaskEntity task);
        Task<bool> DeleteAsync(int id);
    }
}
