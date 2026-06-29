package backend.service;

import backend.dto.UserProfileRequest;
import backend.model.UserAccount;
import backend.model.UserProfile;
import backend.repository.UserProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserAccountService userAccountService;

    public UserProfileService(
            UserProfileRepository userProfileRepository,
            UserAccountService userAccountService
    ) {
        this.userProfileRepository = userProfileRepository;
        this.userAccountService = userAccountService;
    }

    public UserProfile saveProfile(String userId, UserProfileRequest request) {
        UserAccount user = userAccountService.requireUser(userId);

        UserProfile profile = userProfileRepository.findByUser(user)
                .orElseGet(() -> new UserProfile(
                        user,
                        request.fullName(),
                        request.currentTitle(),
                        request.experienceLevel(),
                        request.skills(),
                        request.preferredRole(),
                        request.workMode(),
                        request.desiredSalary()
                ));

        profile.setUser(user);
        profile.setFullName(request.fullName());
        profile.setCurrentTitle(request.currentTitle());
        profile.setExperienceLevel(request.experienceLevel());
        profile.setSkills(request.skills());
        profile.setPreferredRole(request.preferredRole());
        profile.setWorkMode(request.workMode());
        profile.setDesiredSalary(request.desiredSalary());

        return userProfileRepository.save(profile);
    }

    public UserProfile getProfile(String userId) {
        UserAccount user = userAccountService.requireUser(userId);
        return userProfileRepository.findByUser(user).orElse(null);
    }

    public UserProfile requireProfile(String userId) {
        UserProfile profile = getProfile(userId);

        if (profile == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Please complete and save your profile before using this AI feature."
            );
        }

        return profile;
    }
}