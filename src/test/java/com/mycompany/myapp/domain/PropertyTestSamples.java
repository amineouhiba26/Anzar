package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class PropertyTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Property getPropertySample1() {
        return new Property().id(1L).name("name1").location("location1").createdBy("createdBy1").lastModifiedBy("lastModifiedBy1");
    }

    public static Property getPropertySample2() {
        return new Property().id(2L).name("name2").location("location2").createdBy("createdBy2").lastModifiedBy("lastModifiedBy2");
    }

    public static Property getPropertyRandomSampleGenerator() {
        return new Property()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .location(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
