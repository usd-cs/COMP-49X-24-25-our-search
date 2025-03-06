package COMP_49X_our_search.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import proto.core.Core.ModuleConfig;
import proto.profile.ProfileModule.DeleteProfileRequest;
import proto.profile.ProfileModule.ProfileRequest;

@Component
public class MyCommandLineRunner implements CommandLineRunner {

  @Override
  public void run(String... args) throws Exception {
    ModuleConfig moduleConfig = ModuleConfig.newBuilder()
        .setProfileRequest(ProfileRequest.newBuilder()
            .setDeleteProfileRequest(DeleteProfileRequest.newBuilder()
                .setUserEmail("johndoe@test.com")
                )).build();

  }
}

