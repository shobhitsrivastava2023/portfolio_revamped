import { revalidatePath } from "next/cache";

/** Refresh every page that shows drawer items after a write. */
export function revalidateDrawer(id?: string) {
  revalidatePath("/");
  revalidatePath("/drawer");
  if (id) revalidatePath(`/drawer/${id}`);
}
