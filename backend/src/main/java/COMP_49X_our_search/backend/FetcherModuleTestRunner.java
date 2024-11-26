package COMP_49X_our_search.backend;

import COMP_49X_our_search.backend.fetcher.FetcherModuleController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import proto.core.Core.ModuleConfig;
import proto.core.Core.ModuleResponse;
import proto.fetcher.FetcherModule.DirectFetcher;
import proto.fetcher.FetcherModule.DirectType;
import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.DataTypes.DepartmentCollection;
import proto.data.Entities.DepartmentProto;

@Component
public class FetcherModuleTestRunner implements CommandLineRunner {

  private final FetcherModuleController fetcherModuleController;

  @Autowired
  public FetcherModuleTestRunner(FetcherModuleController fetcherModuleController) {
    this.fetcherModuleController = fetcherModuleController;
  }

  @Override
  public void run(String... args) {
    System.out.println("\n=== Testing Fetcher Module ===\n");

    /*
    try {
      // Create the request
      FetcherRequest fetcherRequest =
          FetcherRequest.newBuilder()
              .setDirectFetcher(
                  DirectFetcher.newBuilder().setDirectType(DirectType.DEPARTMENTS).build())
              .build();

      ModuleConfig moduleConfig =
          ModuleConfig.newBuilder().setFetcherRequest(fetcherRequest).build();

      // Process the request
      System.out.println("Sending request to fetch departments...");
      ModuleResponse response = fetcherModuleController.processConfig(moduleConfig);

      // Print the results
      if (response.hasFetcherResponse()) {
        DepartmentCollection departments = response.getFetcherResponse().getDepartmentCollection();
        System.out.println("\nFound " + departments.getDepartmentsCount() + " departments:");
        System.out.println("------------------------");

        for (DepartmentProto dept : departments.getDepartmentsList()) {
          System.out.println("- " + dept.getDepartmentName());
        }
      } else {
        System.out.println("No fetcher response in module response");
      }

    } catch (Exception e) {
      System.err.println("\nError while testing fetcher module:");
      System.err.println("Error type: " + e.getClass().getSimpleName());
      System.err.println("Message: " + e.getMessage());
      e.printStackTrace();
    }

    System.out.println("\n=== Test Complete ===\n");
    */

    ModuleConfig moduleConfig =
        ModuleConfig.newBuilder().setFetcherRequest(FetcherRequest.getDefaultInstance()).build();
    System.out.println(moduleConfig.getModuleRequestCase());
  }
}
