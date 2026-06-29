package backend.repository;

import backend.model.ApplicationCase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationCaseRepository extends JpaRepository<ApplicationCase, String> {
    List<ApplicationCase> findAllByUserIdOrderByCreatedAtDesc(String userId);
    Optional<ApplicationCase> findByIdAndUserId(String id, String userId);
}
