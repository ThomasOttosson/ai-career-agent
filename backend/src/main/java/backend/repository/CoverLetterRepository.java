package backend.repository;

import backend.model.CoverLetter;
import backend.model.JobPosting;
import backend.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CoverLetterRepository extends JpaRepository<CoverLetter, String> {
    Optional<CoverLetter> findTopByJobAndUserOrderByCreatedAtDesc(JobPosting job, UserAccount user);
    List<CoverLetter> findAllByUserOrderByCreatedAtDesc(UserAccount user);
    Optional<CoverLetter> findByIdAndUser(String id, UserAccount user);
}
