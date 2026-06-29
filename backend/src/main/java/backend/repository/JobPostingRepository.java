package backend.repository;

import backend.model.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobPostingRepository extends JpaRepository<JobPosting, String> {
    List<JobPosting> findAllByUserIdOrderByCreatedAtDesc(String userId);
    Optional<JobPosting> findByIdAndUserId(String id, String userId);
}
