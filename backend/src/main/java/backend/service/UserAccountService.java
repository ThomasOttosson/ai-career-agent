package backend.service;

import backend.model.UserAccount;
import backend.repository.UserAccountRepository;
import org.springframework.stereotype.Service;

@Service
public class UserAccountService {

    private final UserAccountRepository userAccountRepository;

    public UserAccountService(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    public UserAccount requireUser(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new RuntimeException("User id is required");
        }

        return userAccountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
