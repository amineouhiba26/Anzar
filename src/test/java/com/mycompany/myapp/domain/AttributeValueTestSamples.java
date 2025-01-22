package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class AttributeValueTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static AttributeValue getAttributeValueSample1() {
        return new AttributeValue().id(1L).valueString("valueString1").createdBy("createdBy1").lastModifiedBy("lastModifiedBy1");
    }

    public static AttributeValue getAttributeValueSample2() {
        return new AttributeValue().id(2L).valueString("valueString2").createdBy("createdBy2").lastModifiedBy("lastModifiedBy2");
    }

    public static AttributeValue getAttributeValueRandomSampleGenerator() {
        return new AttributeValue()
            .id(longCount.incrementAndGet())
            .valueString(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
