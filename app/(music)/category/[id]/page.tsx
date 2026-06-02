"use client";

import { useParams } from "next/navigation";
import { CollectionPage } from "@/components/CollectionPage/CollectionPage";

export default function Page() {
  const params = useParams<{ id: string }>();
  const collectionId = Number(params.id);

  return <CollectionPage collectionId={collectionId} />;
}
