using AutoMapper;
using EventTracker.Auth.Application.DTOs;
using EventTracker.Auth.Domain.Entities;

namespace EventTracker.Auth.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));

            CreateMap<UserProfile, UserDto>();
        }
    }
}