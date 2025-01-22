package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * A Property.
 */
@Entity
@Table(name = "property")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Property implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "price", precision = 21, scale = 2)
    private BigDecimal price;

    @Column(name = "location")
    private String location;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "created_date")
    private ZonedDateTime createdDate;

    @Column(name = "last_modified_by")
    private String lastModifiedBy;

    @Column(name = "last_modified_date")
    private ZonedDateTime lastModifiedDate;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "property")
    @JsonIgnoreProperties(value = { "property" }, allowSetters = true)
    private Set<Media> media = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "property")
    @JsonIgnoreProperties(value = { "property" }, allowSetters = true)
    private Set<AttributeValue> attributes = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "attributeGroups" }, allowSetters = true)
    private CustomConfiguration configuration;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Property id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Property name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return this.price;
    }

    public Property price(BigDecimal price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getLocation() {
        return this.location;
    }

    public Property location(String location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCreatedBy() {
        return this.createdBy;
    }

    public Property createdBy(String createdBy) {
        this.setCreatedBy(createdBy);
        return this;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public ZonedDateTime getCreatedDate() {
        return this.createdDate;
    }

    public Property createdDate(ZonedDateTime createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public String getLastModifiedBy() {
        return this.lastModifiedBy;
    }

    public Property lastModifiedBy(String lastModifiedBy) {
        this.setLastModifiedBy(lastModifiedBy);
        return this;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public ZonedDateTime getLastModifiedDate() {
        return this.lastModifiedDate;
    }

    public Property lastModifiedDate(ZonedDateTime lastModifiedDate) {
        this.setLastModifiedDate(lastModifiedDate);
        return this;
    }

    public void setLastModifiedDate(ZonedDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public Set<Media> getMedia() {
        return this.media;
    }

    public void setMedia(Set<Media> media) {
        if (this.media != null) {
            this.media.forEach(i -> i.setProperty(null));
        }
        if (media != null) {
            media.forEach(i -> i.setProperty(this));
        }
        this.media = media;
    }

    public Property media(Set<Media> media) {
        this.setMedia(media);
        return this;
    }

    public Property addMedia(Media media) {
        this.media.add(media);
        media.setProperty(this);
        return this;
    }

    public Property removeMedia(Media media) {
        this.media.remove(media);
        media.setProperty(null);
        return this;
    }

    public Set<AttributeValue> getAttributes() {
        return this.attributes;
    }

    public void setAttributes(Set<AttributeValue> attributeValues) {
        if (this.attributes != null) {
            this.attributes.forEach(i -> i.setProperty(null));
        }
        if (attributeValues != null) {
            attributeValues.forEach(i -> i.setProperty(this));
        }
        this.attributes = attributeValues;
    }

    public Property attributes(Set<AttributeValue> attributeValues) {
        this.setAttributes(attributeValues);
        return this;
    }

    public Property addAttributes(AttributeValue attributeValue) {
        this.attributes.add(attributeValue);
        attributeValue.setProperty(this);
        return this;
    }

    public Property removeAttributes(AttributeValue attributeValue) {
        this.attributes.remove(attributeValue);
        attributeValue.setProperty(null);
        return this;
    }

    public CustomConfiguration getConfiguration() {
        return this.configuration;
    }

    public void setConfiguration(CustomConfiguration customConfiguration) {
        this.configuration = customConfiguration;
    }

    public Property configuration(CustomConfiguration customConfiguration) {
        this.setConfiguration(customConfiguration);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Property)) {
            return false;
        }
        return getId() != null && getId().equals(((Property) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Property{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", price=" + getPrice() +
            ", location='" + getLocation() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", lastModifiedBy='" + getLastModifiedBy() + "'" +
            ", lastModifiedDate='" + getLastModifiedDate() + "'" +
            "}";
    }
}
