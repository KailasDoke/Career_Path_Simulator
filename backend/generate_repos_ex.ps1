$repoDir = "C:\Users\kaila\Downloads\Career\career-path-simulator\backend\src\main\java\com\careerpaths\repository"
$excDir = "C:\Users\kaila\Downloads\Career\career-path-simulator\backend\src\main\java\com\careerpaths\exception"

New-Item -ItemType Directory -Force -Path $repoDir
New-Item -ItemType Directory -Force -Path $excDir
New-Item -ItemType Directory -Force -Path "C:\Users\kaila\Downloads\Career\career-path-simulator\backend\src\main\java\com\careerpaths\dto"

$repos = "UserRepository", "StudentProfileRepository", "InstitutionRepository", "ProgramRepository", "CareerPathwayRepository", "ScholarshipRepository", "EducationLoanRepository"
foreach ($repo in $repos) {
    $entity = $repo.Replace("Repository", "")
    $content = @"
package com.careerpaths.repository;

import com.careerpaths.entity.$entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface $repo extends JpaRepository<$entity, Long> {
}
"@
    Set-Content -Path "$repoDir\$repo.java" -Value $content
}

# Exceptions
Set-Content -Path "$excDir\ResourceNotFoundException.java" -Value @"
package com.careerpaths.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
"@

Set-Content -Path "$excDir\ValidationException.java" -Value @"
package com.careerpaths.exception;

public class ValidationException extends RuntimeException {
    public ValidationException(String message) {
        super(message);
    }
}
"@

Set-Content -Path "$excDir\GlobalExceptionHandler.java" -Value @"
package com.careerpaths.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(ResourceNotFoundException ex) {
        Map<String, String> error = new HashMap<>();
        error.put(`"error`", `"Not Found`");
        error.put(`"message`", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Map<String, String>> handleValidation(ValidationException ex) {
        Map<String, String> error = new HashMap<>();
        error.put(`"error`", `"Validation Failed`");
        error.put(`"message`", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneric(Exception ex) {
        Map<String, String> error = new HashMap<>();
        error.put(`"error`", `"Internal Server Error`");
        error.put(`"message`", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
"@
