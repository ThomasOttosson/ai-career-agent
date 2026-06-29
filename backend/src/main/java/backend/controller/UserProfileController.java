package backend.controller;

import backend.dto.UserProfileRequest;
import backend.model.UserProfile;
import backend.service.UserProfileService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @PostMapping
    public UserProfile saveProfile(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody UserProfileRequest request
    ) {
        return userProfileService.saveProfile(userId, request);
    }

    @GetMapping
    public UserProfile getProfile(@RequestHeader("X-User-Id") String userId) {
        return userProfileService.getProfile(userId);
    }
}
