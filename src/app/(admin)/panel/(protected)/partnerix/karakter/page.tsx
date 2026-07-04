import { getPartnerixCharacter } from "@/lib/actions/partnerix-character"
import PartnerixCharacterEditor from "@/components/admin/partnerix/PartnerixCharacterEditor"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Partnerix — 3D Karakter" }

export default async function PartnerixCharacterPage() {
  const character = await getPartnerixCharacter()

  return (
    <div className="max-w-4xl">
      <PartnerixCharacterEditor initialData={character} />
    </div>
  )
}
