import { redirect } from "next/navigation";

/** The site is the knowledge base; the root was still the starter scaffold. */
export default function Page() {
  redirect("/design");
}
