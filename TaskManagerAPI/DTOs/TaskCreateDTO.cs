namespace TaskManagerAPI.DTOs
{
    public class TaskCreateDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public int Priority { get; set; }
        public int UserId { get; set; }
    }
}
