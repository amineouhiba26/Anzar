package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AssertUtils.zonedDataTimeSameInstant;
import static org.assertj.core.api.Assertions.assertThat;

public class AdminAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertAdminAllPropertiesEquals(Admin expected, Admin actual) {
        assertAdminAutoGeneratedPropertiesEquals(expected, actual);
        assertAdminAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertAdminAllUpdatablePropertiesEquals(Admin expected, Admin actual) {
        assertAdminUpdatableFieldsEquals(expected, actual);
        assertAdminUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertAdminAutoGeneratedPropertiesEquals(Admin expected, Admin actual) {
        assertThat(expected)
            .as("Verify Admin auto generated properties")
            .satisfies(e -> assertThat(e.getId()).as("check id").isEqualTo(actual.getId()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertAdminUpdatableFieldsEquals(Admin expected, Admin actual) {
        assertThat(expected)
            .as("Verify Admin relevant properties")
            .satisfies(e -> assertThat(e.getUsername()).as("check username").isEqualTo(actual.getUsername()))
            .satisfies(e -> assertThat(e.getFirstName()).as("check firstName").isEqualTo(actual.getFirstName()))
            .satisfies(e -> assertThat(e.getLastName()).as("check lastName").isEqualTo(actual.getLastName()))
            .satisfies(e -> assertThat(e.getEmail()).as("check email").isEqualTo(actual.getEmail()))
            .satisfies(e -> assertThat(e.getPhoneNumber()).as("check phoneNumber").isEqualTo(actual.getPhoneNumber()))
            .satisfies(e -> assertThat(e.getStatus()).as("check status").isEqualTo(actual.getStatus()))
            .satisfies(e -> assertThat(e.getAccessLevel()).as("check accessLevel").isEqualTo(actual.getAccessLevel()))
            .satisfies(e -> assertThat(e.getCreatedBy()).as("check createdBy").isEqualTo(actual.getCreatedBy()))
            .satisfies(e ->
                assertThat(e.getCreatedDate())
                    .as("check createdDate")
                    .usingComparator(zonedDataTimeSameInstant)
                    .isEqualTo(actual.getCreatedDate())
            )
            .satisfies(e -> assertThat(e.getLastModifiedBy()).as("check lastModifiedBy").isEqualTo(actual.getLastModifiedBy()))
            .satisfies(e ->
                assertThat(e.getLastModifiedDate())
                    .as("check lastModifiedDate")
                    .usingComparator(zonedDataTimeSameInstant)
                    .isEqualTo(actual.getLastModifiedDate())
            );
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertAdminUpdatableRelationshipsEquals(Admin expected, Admin actual) {
        assertThat(expected)
            .as("Verify Admin relationships")
            .satisfies(e -> assertThat(e.getAgency()).as("check agency").isEqualTo(actual.getAgency()));
    }
}
