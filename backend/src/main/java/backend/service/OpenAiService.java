package backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class OpenAiService {

    private final RestClient restClient;
    private final String model;

    public OpenAiService(
            @Value("${openai.api.key}") String apiKey,
            @Value("${openai.model}") String model
    ) {
        this.model = model;
        this.restClient = RestClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    public String generateText(String prompt) {
        Map<String, Object> request = Map.of(
                "model", model,
                "input", List.of(
                        Map.of(
                                "role", "user",
                                "content", prompt
                        )
                )
        );

        Map response = restClient.post()
                .uri("/responses")
                .body(request)
                .retrieve()
                .body(Map.class);

        var output = (java.util.List<java.util.Map<String, Object>>) response.get("output");
        var firstMessage = output.get(0);

        var content = (java.util.List<java.util.Map<String, Object>>) firstMessage.get("content");
        var firstContent = content.get(0);

        return firstContent.get("text").toString();
    }

    public String generateJobMatchAnalysis(String prompt) {
        return generateText(prompt);
    }
}