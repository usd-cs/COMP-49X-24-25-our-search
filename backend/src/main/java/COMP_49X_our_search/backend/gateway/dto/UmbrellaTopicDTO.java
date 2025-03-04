package COMP_49X_our_search.backend.gateway.dto;

public class UmbrellaTopicDTO {

    private int id;
    private String name;

    public UmbrellaTopicDTO() {}

    public UmbrellaTopicDTO(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
