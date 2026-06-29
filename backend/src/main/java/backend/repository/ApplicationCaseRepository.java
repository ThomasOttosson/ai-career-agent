package backend.repository;

import backend.model.ApplicationCase;
import backend.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationCaseRepository extends JpaRepository<ApplicationCase, String> {
    List<ApplicationCase> findAllByUserOrderByCreatedAtDesc(UserAccount user);
    Optional<ApplicationCase> findByIdAndUser(String id, UserAccount user);
}
