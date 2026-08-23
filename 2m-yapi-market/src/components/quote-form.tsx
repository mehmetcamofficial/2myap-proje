import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Ruler, Send, X } from 'lucide-react';
import { useCreateQuoteRequest } from '@workspace/api-client-react';
import { CONTACT } from '@/data/site';
import { services } from '@/data/services';

const MAX_FILES = 5;
const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

const quoteZod = z.object({
  name: z.string().min(2, 'Ad soyad yazın.'),
  phone: z.string().min(7, 'Geçerli telefon numara yazın.'),
  service: z.string().min(1, 'Hizmet seçin.'),
  area: z.string().min(2, 'Bölge seçin.'),
  description: z.string().min(10, 'İhtiyacınız 10 karakterle anlatın.'),
  contactMethod: z.enum(['whatsapp', 'phone']),
  honeypot: z.string().optional(),
});

interface PhotoItem { id: string; url: string; name: string }

export function QuoteForm({ compact = false }: { compact?: boolean }) {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [photoError, setPhotoError] = useState('');
  const mutation = useCreateQuoteRequest();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof quoteZod>>({
    resolver: zodResolver(quoteZod),
    defaultValues: { contactMethod: 'whatsapp', service: '', area: '', name: '', phone: '', description: '', honeypot: '' },
  });

  const addPhotos = (files: FileList | null) => {
    setPhotoError('');
    if (!files) return;
    const list = Array.from(files);
    if (list.length + photos.length > MAX_FILES) { setPhotoError(`En fazla ${MAX_FILES} fotoğraf seçebilir.`); return; }
    const next: PhotoItem[] = [];
    for (const f of list) {
      if (!ACCEPTED.includes(f.type)) { setPhotoError(`Desteklenmez format: ${f.name}.`); continue; }
      if (f.size > MAX_BYTES) { setPhotoError(`Büyük foto (max 5 MB): ${f.name}.`); continue; }
      next.push({ id: `${f.name}-${f.lastModified}`, url: URL.createObjectURL(f), name: f.name });
    }
    setPhotos((p) => [...p, ...next]);
  };

  const removePhoto = (id: string) => setPhotos((p) => p.filter((x) => x.id !== id));

  const onSubmit = (values: z.infer<typeof quoteZod>) => {
    mutation.mutate(
      { data: { ...values, photoNames: photos.map((p) => p.name), honeypot: values.honeypot || '' } },
      { onSuccess: () => { reset(); setPhotos((p) => { p.forEach((x) => URL.revokeObjectURL(x.url)); return []; }); } },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-xs font-bold">Ad Soyad<input {...register('name')} placeholder="Adınız soyadınız" className="form-input" />{errors.name && <span className="form-error">{errors.name.message}</span>}</label>
        <label className="grid gap-2 text-xs font-bold">Telefon<input {...register('phone')} placeholder="05xx xxx xx xx" className="form-input" />{errors.phone && <span className="form-error">{errors.phone.message}</span>}</label></div>
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-xs font-bold">Hizmet</span>
        <label className="grid flex-1 gap-2 text-xs"><select {...register('service')} className="form-input"><option value="">Hizmet seçin</option>{services.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}</select>{errors.service && <span className="form-error">{errors.service.message}</span>}</label>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-xs font-bold">Bölge</span>
        <label className="grid flex-1 gap-2 text-xs"><select {...register('area')} className="form-input"><option value="">Bölgenizi seçin</option>{CONTACT.areas.map((a) => <option key={a} value={a}>{a}</option>)}</select>{errors.area && <span className="form-error">{errors.area.message}</span>}</label>
      </div>
      <label className="grid gap-2 text-xs font-bold">İhtiyacınız nedir?<textarea {...register('description')} rows={compact ? 3 : 4} placeholder="Mekânı, yapılacak işi veya mevcut durumu kısaca anlatın." className="form-input resize-none" />{errors.description && <span className="form-error">{errors.description.message}</span>}</label>
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-xs font-bold">Nasıl ulaşalım?</span>
        <label className="flex items-center gap-2 text-xs"><input {...register('contactMethod')} value="whatsapp" type="radio" className="accent-[hsl(var(--primary))]" /> WhatsApp</label>
        <label className="flex items-center gap-2 text-xs"><input {...register('contactMethod')} value="phone" type="radio" className="accent-[hsl(var(--primary))]" /> Telefon</label>
      </div>
      <label className="flex cursor-pointer items-center gap-3 border border-dashed border-[hsl(var(--border))] px-4 py-3 text-xs text-[hsl(var(--muted-foreground))]">
        <Ruler size={16} /> {photos.length ? `Seçildi: ${photos.length} fotoğraf` : `Fotoğraf ekleyin (max ${MAX_FILES})`}
        <input type="file" accept="image/*" multiple className="hidden" data-testid="input-quote-photos" onChange={(e) => { addPhotos(e.target.files); e.target.value = ''; }} />
      </label>
      {photoError && <p role="alert" className="form-error">{photoError}</p>}
      {photos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {photos.map((p) => (
            <div key={p.id} className="relative h-16 w-16 overflow-hidden border border-[hsl(var(--border))]">
              <img src={p.url} alt="" className="h-full w-full object-cover" />
              <button type="button" aria-label="Fotoğrafı kalıdır" onClick={() => removePhoto(p.id)} className="absolute right-0 top-0 grid h-5 w-5 place-items-center bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] text-[10px]"><X size={12} /></button>
            </div>
          ))}
        </div>
      )}
      <input {...register('honeypot')} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      {mutation.isError && <div role="alert" className="border border-[hsl(var(--destructive)/.3)] bg-[hsl(var(--destructive)/.06)] px-3 py-2 text-xs text-[hsl(var(--destructive))]">Gönderilemedi. WhatsApp üzerinden yazın.</div>}
      <button type="submit" disabled={mutation.isPending} className="flex w-full items-center justify-center gap-2 bg-[hsl(var(--primary))] px-5 py-4 text-xs font-extrabold uppercase tracking-[.14em] text-[hsl(var(--primary-foreground))] disabled:opacity-60">{mutation.isPending ? 'Gönderiliyor...' : 'Keşif talebi gönder'} <Send size={15} /></button>
    </form>
  );
}
