package backend.service;

import backend.dto.UserProfileRequest;
import backend.model.UserProfile;
import backend.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;

    public UserProfileService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    public UserProfile saveProfile(String userId, UserProfileRequest request) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElse(new UserProfile());

        profile.setId(userId);
        profile.setUserId(userId);
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
        return userProfileRepository.findByUserId(userId).orElse(null);
    }

    public UserProfile requireProfile(String userId) {
        UserProfile profile = getProfile(userId);

        if (profile == null) {
            throw new RuntimeException("User profile not found");
        }

        return profile;
    }
}
