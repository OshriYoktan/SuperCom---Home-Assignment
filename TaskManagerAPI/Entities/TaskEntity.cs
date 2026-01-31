using System.ComponentModel.DataAnnotations;
using TaskManagerAPI.Entities;

namespace TaskManagerAPI.Models
{
    public class TaskEntity
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        [Required]
        [Range(1, 5)]
        public int Priority { get; set; }

        [Required]
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
