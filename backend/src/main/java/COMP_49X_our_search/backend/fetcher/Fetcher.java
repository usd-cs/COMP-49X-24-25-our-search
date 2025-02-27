/**
 * Interface for fetcher implementation.
 * Defines a method for processing fetcher requests and returning fetcher
 * responses.
 *
 * Implementing classes are responsible for handling data retrieval logic
 * and converting the data into protobuf responses.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.fetcher;

import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.FetcherModule.FetcherResponse;

public interface Fetcher {
  FetcherResponse fetch(FetcherRequest request);
}
