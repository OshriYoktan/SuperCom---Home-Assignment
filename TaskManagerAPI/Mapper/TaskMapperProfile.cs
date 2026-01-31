using AutoMapper;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Mapper
{
    public class TaskMapperProfile : Profile
    {
        public TaskMapperProfile() {
            CreateMap<TaskEntity, TaskDTO>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.User.FullName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.Telephone, opt => opt.MapFrom(src => src.User.Telephone));

            CreateMap<TaskDTO, TaskEntity>();

            CreateMap<TaskCreateDTO, TaskEntity>();

        }

    }
}
