package com.jdsn.notificationservice.client;

import com.jdsn.notificationservice.dto.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Component
@RequiredArgsConstructor
public class UserClient {

    private final RestTemplate restTemplate;

    @Value("${services.auth-url:http://auth-service}")
    private String authServiceUrl;
    @Value("${internal.secret:internal-secret-inventory-app}")
    private String internalSecret;

    public List<UserDto> getUsersByRoles(List<String> roles) {
        String rolesParam = String.join(",", roles);
        String url = authServiceUrl
                + "/api/users/by-roles?roles=" + rolesParam;
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Internal-Secret", internalSecret);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<List<UserDto>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<UserDto>>() {}
        );

        return response.getBody() != null
                ? response.getBody()
                : List.of();
    }
}
