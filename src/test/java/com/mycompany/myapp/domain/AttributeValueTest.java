package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AttributeValueTestSamples.*;
import static com.mycompany.myapp.domain.PropertyTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AttributeValueTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AttributeValue.class);
        AttributeValue attributeValue1 = getAttributeValueSample1();
        AttributeValue attributeValue2 = new AttributeValue();
        assertThat(attributeValue1).isNotEqualTo(attributeValue2);

        attributeValue2.setId(attributeValue1.getId());
        assertThat(attributeValue1).isEqualTo(attributeValue2);

        attributeValue2 = getAttributeValueSample2();
        assertThat(attributeValue1).isNotEqualTo(attributeValue2);
    }

    @Test
    void propertyTest() {
        AttributeValue attributeValue = getAttributeValueRandomSampleGenerator();
        Property propertyBack = getPropertyRandomSampleGenerator();

        attributeValue.setProperty(propertyBack);
        assertThat(attributeValue.getProperty()).isEqualTo(propertyBack);

        attributeValue.property(null);
        assertThat(attributeValue.getProperty()).isNull();
    }
}
