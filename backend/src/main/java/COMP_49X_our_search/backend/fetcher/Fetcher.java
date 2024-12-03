package COMP_49X_our_search.backend.fetcher;

import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.FetcherModule.FetcherResponse;

public interface Fetcher {
  FetcherResponse fetch(FetcherRequest request);
}
