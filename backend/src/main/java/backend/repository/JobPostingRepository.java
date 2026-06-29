package backend.repository;

import backend.model.JobPosting;
import backend.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobPostingRepository extends JpaRepository<JobPosting, String> {
    List<JobPosting> findAllByUserOrderByCreatedAtDesc(UserAccount user);
    Optional<JobPosting> findByIdAndUser(String id, UserAccount user);
}
