using TaskManagerAPI.Entities;

namespace TaskManagerAPI.Interfaces
{
    public interface IUserRepository
    {
        Task<User> CreateUser(User task);
    }
}
