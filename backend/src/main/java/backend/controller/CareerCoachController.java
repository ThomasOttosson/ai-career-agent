package backend.controller;

import backend.dto.CareerCoachRequest;
import backend.service.CareerCoachService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/career-coach")
public class CareerCoachController {

    private final CareerCoachService careerCoachService;

    public CareerCoachController(CareerCoachService careerCoachService) {
        this.careerCoachService = careerCoachService;
    }

    @PostMapping
    public String askCoach(@RequestBody CareerCoachRequest request) {
        return careerCoachService.askCoach(request);
    }
}