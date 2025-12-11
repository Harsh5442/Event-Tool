namespace EventTracker.Auth.Domain.Exceptions
{
    public class DomainException : Exception
    {
        public DomainException(string message) : base(message) { }
    }

    public class UserNotFoundException : DomainException
    {
        public UserNotFoundException(Guid userId) 
            : base($"User with ID {userId} not found") { }
    }

    public class InvalidEmailException : DomainException
    {
        public InvalidEmailException(string email) 
            : base($"Email '{email}' is invalid") { }
    }

    public class UserAlreadyExistsException : DomainException
    {
        public UserAlreadyExistsException(string email) 
            : base($"User with email '{email}' already exists") { }
    }
}