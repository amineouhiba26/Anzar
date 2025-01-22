package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AttributeValueTestSamples.*;
import static com.mycompany.myapp.domain.CustomConfigurationTestSamples.*;
import static com.mycompany.myapp.domain.MediaTestSamples.*;
import static com.mycompany.myapp.domain.PropertyTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class PropertyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Property.class);
        Property property1 = getPropertySample1();
        Property property2 = new Property();
        assertThat(property1).isNotEqualTo(property2);

        property2.setId(property1.getId());
        assertThat(property1).isEqualTo(property2);

        property2 = getPropertySample2();
        assertThat(property1).isNotEqualTo(property2);
    }

    @Test
    void mediaTest() {
        Property property = getPropertyRandomSampleGenerator();
        Media mediaBack = getMediaRandomSampleGenerator();

        property.addMedia(mediaBack);
        assertThat(property.getMedia()).containsOnly(mediaBack);
        assertThat(mediaBack.getProperty()).isEqualTo(property);

        property.removeMedia(mediaBack);
        assertThat(property.getMedia()).doesNotContain(mediaBack);
        assertThat(mediaBack.getProperty()).isNull();

        property.media(new HashSet<>(Set.of(mediaBack)));
        assertThat(property.getMedia()).containsOnly(mediaBack);
        assertThat(mediaBack.getProperty()).isEqualTo(property);

        property.setMedia(new HashSet<>());
        assertThat(property.getMedia()).doesNotContain(mediaBack);
        assertThat(mediaBack.getProperty()).isNull();
    }

    @Test
    void attributesTest() {
        Property property = getPropertyRandomSampleGenerator();
        AttributeValue attributeValueBack = getAttributeValueRandomSampleGenerator();

        property.addAttributes(attributeValueBack);
        assertThat(property.getAttributes()).containsOnly(attributeValueBack);
        assertThat(attributeValueBack.getProperty()).isEqualTo(property);

        property.removeAttributes(attributeValueBack);
        assertThat(property.getAttributes()).doesNotContain(attributeValueBack);
        assertThat(attributeValueBack.getProperty()).isNull();

        property.attributes(new HashSet<>(Set.of(attributeValueBack)));
        assertThat(property.getAttributes()).containsOnly(attributeValueBack);
        assertThat(attributeValueBack.getProperty()).isEqualTo(property);

        property.setAttributes(new HashSet<>());
        assertThat(property.getAttributes()).doesNotContain(attributeValueBack);
        assertThat(attributeValueBack.getProperty()).isNull();
    }

    @Test
    void configurationTest() {
        Property property = getPropertyRandomSampleGenerator();
        CustomConfiguration customConfigurationBack = getCustomConfigurationRandomSampleGenerator();

        property.setConfiguration(customConfigurationBack);
        assertThat(property.getConfiguration()).isEqualTo(customConfigurationBack);

        property.configuration(null);
        assertThat(property.getConfiguration()).isNull();
    }
}
