# Architecture Overview

```txt
src/features/{folderName}/
├── types/{filename}Types.ts
├── states/{filename}States.ts
├── services/{filename}Services.ts
├── controllers/{filename}Controllers.ts
└── components/{filename}{Action}.tsx
```

> states, services, dan controllers hanya boleh berhubungan dengan API yang sudah dibuat. Jangan mendefinisikan hal lain di luar itu.

## Tech Stack

- **Framework**: Next.js 14 (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/UI
- **Server State**: TanStack Query (`@tanstack/react-query`)
- **Client State**: Zustand
- **Forms**: React Hook Form + Zod
- **Database ORM**: Prisma (PostgreSQL)

---

## Shared Directory

```txt
src/shared/
├── lib/
│   ├── prisma.ts       # Prisma client singleton
│   └── utils.ts        # cn() utility
├── styles/
│   └── globals.css     # Tailwind base + Shadcn CSS variables
└── locales/
    ├── en.json
    └── id.json
```

---

## Function Naming Rules

| Prefix      | Service | Controller | emit | UI Component | Utilisasi (inner function) |
| ----------- | :-----: | :--------: | :--: | :----------: | :------------------------: |
| `get`       |   ✅    |     ❌     |  ❌  |      ❌      |             ✅              |
| `post`      |   ✅    |     ❌     |  ❌  |      ❌      |             ✅              |
| `update`    |   ✅    |     ❌     |  ❌  |      ❌      |             ✅              |
| `patch`     |   ✅    |     ❌     |  ❌  |      ❌      |             ✅              |
| `delete`    |   ✅    |     ❌     |  ❌  |      ❌      |             ✅              |
| `fetch`     |   ❌    |     ✅     |  ❌  |      ❌      |             ❌              |
| `store`     |   ❌    |     ✅     |  ❌  |      ❌      |             ❌              |
| `change`    |   ❌    |     ✅     |  ❌  |      ❌      |             ❌              |
| `remove`    |   ❌    |     ✅     |  ❌  |      ❌      |             ❌              |
| `load`      |   ❌    |     ❌     |  ✅  |      ✅      |             ❌              |
| `save`      |   ❌    |     ❌     |  ✅  |      ✅      |             ❌              |
| `sync`      |   ❌    |     ❌     |  ✅  |      ✅      |             ❌              |
| `destroy`   |   ❌    |     ❌     |  ✅  |      ✅      |             ❌              |

---

## Penamaan Folder & File

Dari URL endpoint, buang segmen berikut:
- Base URL / domain
- Prefix `api`
- Versioning: segmen yang cocok pola `v{angka}` (contoh: `v1`, `v2`)

Sisa path yang bermakna dibagi menjadi tiga konsep:

| Konsep | Aturan | Digunakan untuk |
|--------|--------|-----------------|
| **folderName** | Segmen **pertama** sisa path, `kebab-case` | Nama folder domain |
| **fileName** | `folderName` dikonversi ke `camelCase` | Prefix nama file `.ts` |
| **resourceName** | gabungan semua segmen, digabung `PascalCase` | Nama TypeScript: types, controllers, services, states |

**Contoh:**

| URL | folderName | fileName | resourceName |
|-----|------------|----------|--------------|
| `/api/v1/users/profile` | `users` | `users` | `UsersProfile` |
| `/api/v1/ai-search/register/file/{type}/{id}` | `ai-search` | `aiSearch` | `AiSearchRegisterFile` |

> Segmen dinamis (`{param}`) selalu diabaikan.

---

## Aturan Per File

### Types (`{filename}Types.ts`)

```typescript
// Payload: hanya untuk GET & POST
export interface Payload{Method}{ResourceName} {
  field: type
}

// ⚠️ Hanya buat jika response API mengembalikan data (bukan void/empty)
export interface Data{ResourceName} {
  id: string
  // ... fields
}

// Reactive state shape
export interface {ResourceName} {
  status: string         // 'loading' | 'error' | 'empty' | 'success' — selalu ada
  statusTitle: string    // selalu ada
  statusSubtitle: string // selalu ada
  data: Data{ResourceName} | null  // hanya jika response tidak kosong/void
}
```

**Kapan `Data{ResourceName}` & field `data` dibuat:**

| Kondisi response | Buat `Data{ResourceName}`? | Tambah field `data`? |
|------------------|---------------------------|----------------------|
| Mengembalikan objek/array | ✅ Ya | ✅ Ya |
| Void / empty (misal DELETE) | ❌ Tidak | ❌ Tidak |

Default values: `string → ""`, `number → 0`, `boolean → false`, `Array → []`, `Object → {}`

---

### States (`{filename}States.ts`)

Gunakan **Zustand** untuk client state.

```typescript
import { create } from 'zustand'
import type { Payload{Method}{ResourceName}, {ResourceName} } from '../types/{filename}Types'

interface {Filename}Store {
  payload{Method}{ResourceName}: Payload{Method}{ResourceName}
  {camelResourceName}: {ResourceName}

  setPayload{Method}{ResourceName}: (payload: Partial<Payload{Method}{ResourceName}>) => void
  set{ResourceName}: (payload: Partial<{ResourceName}>) => void
}

export const use{Filename}States = create<{Filename}Store>((set) => ({
  payload{Method}{ResourceName}: {
    field: 'defaultValue',
  },

  {camelResourceName}: {
    status: 'loading',
    statusTitle: 'Something went wrong',
    statusSubtitle: 'Please try again later.',
    data: null
  },

  setPayload{Method}{ResourceName}: (payload: Partial<Payload{Method}{ResourceName}>) =>
    set((state) => ({
      payload{Method}{ResourceName}: { ...state.payload{Method}{ResourceName}, ...payload },
    })),

  set{ResourceName}: (payload: Partial<{ResourceName}>) =>
    set((state) => ({
      {camelResourceName}: { ...state.{camelResourceName}, ...payload },
    })),
}))
```

**Aturan**:
- Setiap setter harus punya explicit type annotation pada parameter
- Hanya state dan setter, tidak ada async logic
- **Data dari React Query harus di-assign ke Zustand** — gunakan setter saat fetch/mutation success
- Zustand jadi single source of truth: status + data semuanya di store
- Payload hanya untuk GET & POST, tidak untuk PATCH/PUT/DELETE
- Import `Partial<T>` dari TypeScript untuk partial updates

---

### Services (`{filename}Services.ts`)

```typescript
import type { Payload{Method}{ResourceName} } from '../types/{filename}Types'

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

// ✅ BENAR
export const {get|post|put|delete}{ResourceName} = async (payload?: Payload{Method}{ResourceName}) => {
  try {
    const queryString = payload ? '?' + new URLSearchParams(payload as Record<string, string>).toString() : ''
    const res = await fetch(`${baseUrl}/path/to/endpoint${queryString}`, {
      method: '{METHOD}',
      headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify(payload), // hanya untuk POST/PUT/PATCH
    })
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

// ❌ DILARANG — jangan tulis return type annotation
export const {get|post|put|delete}{ResourceName} = async (payload): Promise<Data{ResourceName} | null> => { ... }
```

**Aturan**: Tidak ada state logic. Hanya pure API call. **Dilarang menulis return type annotation**.

---

### Controllers (`{filename}Controllers.ts`)

Gunakan **TanStack Query** untuk server state management. Sync status ke Zustand store hanya untuk server state yang perlu di-update dari controller.

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { use{Filename}States } from '../states/{filename}States'
import {
  get{ResourceName},
  post{ResourceName},
  patch{ResourceName},
  delete{ResourceName},
} from '../services/{filename}Services'
import type { Payload{Method}{ResourceName} } from '../types/{filename}Types'

export const use{Filename}Controllers = () => {
  const queryClient = useQueryClient()
  const { set{ResourceName} } = use{Filename}States()

  const fetch{ResourceName} = useQuery({
    queryKey: ['{resourceName}'],
    queryFn: async () => {
      set{ResourceName}({ status: 'loading' })
      try {
        const data = await get{ResourceName}()
        set{ResourceName}({ status: 'success', statusTitle: 'Success', data })
        return data
      } catch (error) {
        const err = error instanceof Error ? error.message : 'Failed to fetch'
        set{ResourceName}({ status: 'error', statusTitle: 'Error', statusSubtitle: err })
        throw error
      }
    },
  })

  const store{ResourceName} = useMutation({
    mutationFn: (payload: Payload{Method}{ResourceName}) => post{ResourceName}(payload),
    onMutate: () => {
      set{ResourceName}({ status: 'loading', statusTitle: 'Saving...' })
    },
    onSuccess: () => {
      set{ResourceName}({ status: 'success', statusTitle: 'Saved' })
      queryClient.invalidateQueries({ queryKey: ['{resourceName}'] })
    },
    onError: (error) => {
      const err = error instanceof Error ? error.message : 'Failed to create'
      set{ResourceName}({ status: 'error', statusTitle: 'Error', statusSubtitle: err })
    },
  })

  const change{ResourceName} = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Payload{Method}{ResourceName}> }) =>
      patch{ResourceName}(id, payload),
    onMutate: () => {
      set{ResourceName}({ status: 'loading', statusTitle: 'Updating...' })
    },
    onSuccess: () => {
      set{ResourceName}({ status: 'success', statusTitle: 'Updated' })
      queryClient.invalidateQueries({ queryKey: ['{resourceName}'] })
    },
    onError: (error) => {
      const err = error instanceof Error ? error.message : 'Failed to update'
      set{ResourceName}({ status: 'error', statusTitle: 'Error', statusSubtitle: err })
    },
  })

  const remove{ResourceName} = useMutation({
    mutationFn: (id: string) => delete{ResourceName}(id),
    onMutate: () => {
      set{ResourceName}({ status: 'loading', statusTitle: 'Deleting...' })
    },
    onSuccess: () => {
      set{ResourceName}({ status: 'success', statusTitle: 'Deleted' })
      queryClient.invalidateQueries({ queryKey: ['{resourceName}'] })
    },
    onError: (error) => {
      const err = error instanceof Error ? error.message : 'Failed to delete'
      set{ResourceName}({ status: 'error', statusTitle: 'Error', statusSubtitle: err })
    },
  })

  return {
    fetch{ResourceName},
    store{ResourceName},
    change{ResourceName},
    remove{ResourceName},
  }
}
```

**Aturan:**
- **Only server state:** Zustand store hanya untuk state yang di-update dari controller (server state), bukan untuk UI selections atau temporary states
- **Data assignment:** Assign data dari React Query ke Zustand store saat success: `set{ResourceName}({ data })`
- **Status sync:** Update status (loading, success, error) menggunakan setter ketika query/mutation state berubah
- **Error handling:** Extract error message dengan `error instanceof Error ? error.message : fallback` dan tampilkan di `statusSubtitle`
- **Cache invalidation:** Invalidate cache setelah mutation berhasil agar refetch otomatis

**Prefix method controller:**

| HTTP | Prefix | Contoh | Hook |
|------|--------|--------|------|
| GET | `fetch` | `fetchUsersProfile()` | `useQuery` |
| POST | `store` | `storeRegisterFile()` | `useMutation` |
| PUT/PATCH | `change` | `changeUsersProfile()` | `useMutation` |
| DELETE | `remove` | `removeUsersProfile()` | `useMutation` |

---

### Components (`{filename}{Action}.tsx`)

```typescript
'use client' // hanya jika butuh interaktivitas
```

**Aturan**:

#### 1. Struktur Penulisan Kode React

Urutan penulisan wajib mengikuti struktur berikut:

```tsx
import { useState } from 'react'
import type { DataUsersProfile } from './types/usersTypes'
import { useUsersStates } from './states/usersStates'
import { useUsersControllers } from './controllers/usersControllers'

interface Props {
  userId: string
}

export default function UsersList({ userId }: Props) {
  const { fetchUsersProfile } = useUsersControllers()

  const [loading, setLoading] = useState(false)
  const { usersProfile } = useUsersStates()
  const isEmptyData = !usersProfile.data

  const handleSubmit = () => {}

  useEffect(() => {}, [])

  return (
    <div>
      {/* template hanya untuk rendering */}
    </div>
  )
}
```
**Aturan**:
- variable importer, states / variable, function / methode, lifeycle react (useEffect, useMemo, etc)

---

#### 2. Penggunaan Template
- Template hanya bertanggung jawab untuk rendering UI.
- Dilarang menulis business logic kompleks langsung di JSX.
- Dilarang menggunakan expression yang panjang atau nested condition yang sulit dibaca.
- Logic perhitungan harus dipindahkan ke variabel derived, handler, atau custom hook.
- Setiap section besar wajib dipisahkan menjadi komponen tersendiri.
- Gunakan komponen Shadcn/UI terlebih dahulu sebelum membuat elemen custom.
- Hindari nested JSX yang terlalu dalam (> 3 level).
- Setiap komponen child harus menerima data melalui props dan mengirim aksi melalui callback props.
- Dilarang mengakses state milik komponen lain secara langsung dari JSX.

Contoh:

```tsx
// ❌ Salah
<div>{users.filter(user => user.active).length}</div>

// ✅ Benar
const activeUsersCount = users.filter((u) => u.active).length
<div>{activeUsersCount}</div>
```

---

#### 3. Penggunaan Existing Component

Urutan pencarian komponen wajib:

```text
1. Shadcn/UI Component (src/components/ui)
2. Existing Component Project (src/components)
3. Reusable Component
4. Buat Component Baru
```

Sebelum membuat komponen baru wajib memeriksa:

```text
src/features/{nama_feature}/components
```

Ketentuan:
- Dilarang membuat komponen yang memiliki fungsi sama dengan komponen existing.
- Dilarang melakukan duplikasi wrapper component tanpa alasan yang jelas.
- Jika hanya berbeda sedikit behavior atau tampilan, lakukan extend terhadap komponen existing.
- Props harus mengikuti pola komponen yang sudah ada.
- Nama komponen harus konsisten dengan domain fitur.
- Komponen parent bertanggung jawab terhadap koordinasi data.
- Komponen child bertanggung jawab terhadap rendering dan aksi spesifik.
- Reusable component tidak boleh mengandung business logic fitur tertentu.
- Feature component tidak boleh digunakan sebagai pengganti reusable component jika kebutuhan bersifat umum.

---

#### 4. React Hook Form + Zod (untuk form)

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
})

type FormValues = z.infer<typeof schema>

const form = useForm<FormValues>({
  resolver: zodResolver(schema),
  defaultValues: { name: '' },
})
```

---

# Final Rules

- Tidak boleh merubah kode, UI/UX, dan logika lain yang sudah ada.
- Tidak boleh ada penambahan atau perbaikan diluar kebutuhan task.
- Tidak boleh menggunakan penamaan function diluar dari convention yang sudah ditentukan.
- Harus melakukan utilisasi dengan membuat function baru di dalam parent function.
- Function utilitas tidak boleh berada di luar parent function.
- Penamaan callback props menggunakan rumus `(action + subject)`:
  ```tsx
  onCreateUser={handleCreateUser}
  onUpdateUser={handleUpdateUser}
  onDeleteUser={handleDeleteUser}

  onOpenModal={handleOpenModal}
  onCloseModal={handleCloseModal}
  ```

---

# Code Quality Rules (SonarQube + ESLint)

> **⚠️ WAJIB DIPATUHI. Setiap AI assistant yang bekerja di project ini HARUS mengikuti aturan SonarQube dan ESLint tanpa terkecuali.**

## SonarQube Rules
- Cognitive Complexity maksimal **15** per function
- Function parameters maksimal **7**
- Dilarang nested template literals
- Dilarang array index sebagai `key`
- Dilarang `onClick`/`onKeyDown` pada non-native interactive elements — gunakan `<button>`, `<dialog>`, atau tambahkan `role` + `tabIndex`
- Setiap `<label>` harus punya `htmlFor`
- Text vs background harus memenuhi contrast WCAG AA
- Hapus semua unused imports/variables
- Prefer `?.` daripada `&&` chain
- Prefer `String#replaceAll()` untuk global replacement
- Prefer `.at(-1)` untuk akses elemen terakhir

## ESLint Rules
- Accessibility (jsx-a11y): `<img>` harus `alt`, `<a>` harus `href`
- Props pakai `Readonly<>` wrapper
- Jangan pakai `any` type
- Dilarang `// eslint-disable-next-line` kecuali unavoidable
- Import order: React/Next.js → Third-party → Types → Internal → Components

---

## AI Assistant Memory Directive

> **SETIAP AI CODING ASSISTANT (Claude, Copilot, Cursor, Codeium, dll) YANG BEKERJA DI PROJECT INI WAJIB:**
> 1. Membaca dan memahami seluruh isi file ini sebelum menulis kode apapun.
> 2. Mematuhi semua aturan di atas.
> 3. Melakukan verifikasi `npx tsc --noEmit` dan cek lint errors setelah setiap perubahan.
> 4. Project ini menggunakan **Next.js 14 Pages Router** — tidak boleh menggunakan App Router.
