package backend.repository;

import backend.model.CoverLetter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CoverLetterRepository extends JpaRepository<CoverLetter, String> {
    Optional<CoverLetter> findTopByJobIdAndUserIdOrderByCreatedAtDesc(String jobId, String userId);
    List<CoverLetter> findAllByUserIdOrderByCreatedAtDesc(String userId);
    Optional<CoverLetter> findByIdAndUserId(String id, String userId);
}
