package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class AttributeTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Attribute getAttributeSample1() {
        return new Attribute().id(1L).name("name1").type("type1").createdBy("createdBy1").lastModifiedBy("lastModifiedBy1");
    }

    public static Attribute getAttributeSample2() {
        return new Attribute().id(2L).name("name2").type("type2").createdBy("createdBy2").lastModifiedBy("lastModifiedBy2");
    }

    public static Attribute getAttributeRandomSampleGenerator() {
        return new Attribute()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .type(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
