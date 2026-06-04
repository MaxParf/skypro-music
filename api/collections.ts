import { requestJson } from "@/api/client";
import type { ApiResponse } from "@/types/api";
import type {
  ApiCollection,
  Collection,
  CollectionSummary,
} from "@/types/collection";

const mapCollection = (collection: ApiCollection): Collection => ({
  id: collection._id,
  title: collection.name?.trim() || `Подборка ${collection._id}`,
  trackIds: collection.items,
});

export async function fetchCollections() {
  const response = await requestJson<ApiResponse<ApiCollection[]>>(
    "/catalog/selection/all/",
    {
      method: "GET",
    },
  );

  return response.data.map(
    (collection): CollectionSummary => ({
      id: collection._id,
      title: collection.name?.trim() || `Подборка ${collection._id}`,
      trackIds: collection.items,
    }),
  );
}

export async function fetchCollectionById(collectionId: number) {
  const response = await requestJson<ApiResponse<ApiCollection | null>>(
    `/catalog/selection/${collectionId}/`,
    {
      method: "GET",
    },
  );

  return response.data ? mapCollection(response.data) : null;
}
