using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Entities;
using TaskManagerAPI.Interfaces;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<UsersController> _logger;

        public UsersController(
            IUserRepository userRepository,
            IMapper mapper,
            ILogger<UsersController> logger)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _logger = logger;
        }


        [HttpPost]
        public async Task<ActionResult<UserDTO>> Create([FromBody] UserDTO userDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var entity = _mapper.Map<User>(userDto);
            var created = await _userRepository.CreateUser(entity);

            _logger.LogInformation("Task created with id {TaskId}", created.Id);

            return CreatedAtAction(
                nameof(Create),
                new { userId = created.Id },
                _mapper.Map<UserDTO>(created)
            );
        }
    }
}
