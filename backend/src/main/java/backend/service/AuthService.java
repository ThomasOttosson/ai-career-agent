package backend.service;

import backend.dto.AuthRequest;
import backend.dto.AuthResponse;
import backend.model.UserAccount;
import backend.repository.UserAccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    public AuthResponse register(AuthRequest request) {
        if (userAccountRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        UserAccount user = new UserAccount(
                request.email(),
                passwordEncoder.encode(request.password())
        );
        UserAccount savedUser = userAccountRepository.save(user);

        return new AuthResponse(savedUser.getId(), savedUser.getEmail(), "Registered successfully");
    }

    public AuthResponse login(AuthRequest request) {
        UserAccount user = userAccountRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return new AuthResponse(user.getId(), user.getEmail(), "Logged in successfully");
    }
}