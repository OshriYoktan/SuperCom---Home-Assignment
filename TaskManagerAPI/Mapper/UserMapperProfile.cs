using AutoMapper;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Entities;

namespace TaskManagerAPI.Mapper
{
    public class UserMapperProfile : Profile
    {
        public UserMapperProfile() {
            CreateMap<User, UserDTO>();

            CreateMap<UserDTO, User>();
        }

    }
}
