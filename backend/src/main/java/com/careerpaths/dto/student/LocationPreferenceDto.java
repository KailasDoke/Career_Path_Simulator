package com.careerpaths.dto.student;

import lombok.Data;
import java.util.List;

@Data
public class LocationPreferenceDto {
    private List<String> preferredCountries;
    private List<String> preferredRegions;
    private String preferredCityType;
    private Boolean willingToStudyAbroad;
    private String distancePreference;
}
