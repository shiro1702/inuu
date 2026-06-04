<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <h1 class="text-2xl font-semibold">Контент AI и новости</h1>
      <p class="text-sm text-gray-600">
        Проверка AI-парсинга, ingestion и ручное добавление новостей. Настройки чатов и парсинг-источников задаются отдельно для каждого города.
      </p>
    </header>

    <div v-if="loadingCities" class="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600">
      Загружаем города менеджера...
    </div>
    <div v-else-if="!managerCities.length" class="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
      У аккаунта нет городов в manager scope. Нужна привязка к `shop_members`.
    </div>

    <template v-else>
      <div class="rounded-lg border border-gray-200 bg-white p-4">
        <label class="block space-y-1 text-sm">
          <span class="font-medium text-gray-700">Город</span>
          <select v-model="selectedCitySlug" class="w-full rounded-lg border border-gray-300 px-3 py-2">
            <option v-for="city in managerCities" :key="city.citySlug" :value="city.citySlug">
              {{ city.cityName }} ({{ city.citySlug }})
            </option>
          </select>
        </label>
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <article class="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
          <h2 class="text-lg font-semibold">Настройки TG/MAX по городу</h2>
          <p class="text-xs text-gray-500">Менеджерские чаты, чат модерации и списки групп/каналов для парсинга.</p>

          <div class="grid gap-3 md:grid-cols-2">
            <label class="space-y-1 text-sm">
              <span class="font-medium text-gray-700">TG manager chat id</span>
              <input v-model="settingsForm.telegramManagerChatId" class="w-full rounded-lg border border-gray-300 px-3 py-2" />
            </label>
            <label class="space-y-1 text-sm">
              <span class="font-medium text-gray-700">TG moderation chat id</span>
              <input v-model="settingsForm.telegramModerationChatId" class="w-full rounded-lg border border-gray-300 px-3 py-2" />
            </label>
            <label class="space-y-1 text-sm">
              <span class="font-medium text-gray-700">MAX manager chat id</span>
              <input v-model="settingsForm.maxManagerChatId" class="w-full rounded-lg border border-gray-300 px-3 py-2" />
            </label>
            <label class="space-y-1 text-sm">
              <span class="font-medium text-gray-700">MAX moderation chat id</span>
              <input v-model="settingsForm.maxModerationChatId" class="w-full rounded-lg border border-gray-300 px-3 py-2" />
            </label>
          </div>

          <div class="space-y-2 text-sm">
            <span class="font-medium text-gray-700">TG parser source chats</span>
            <div class="flex flex-wrap gap-2">
              <span v-for="chat in settingsForm.telegramParserSourceChats" :key="`tg-${chat}`" class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-mono text-blue-800">
                {{ chat }}
                <button type="button" class="text-blue-700 hover:text-blue-900" @click="removeParserChat('telegram', chat)">×</button>
              </span>
              <span v-if="!settingsForm.telegramParserSourceChats.length" class="text-xs text-gray-500">Список пуст</span>
            </div>
            <div class="flex gap-2">
              <input
                v-model="settingsForm.telegramParserSourceInput"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs"
                placeholder="-1001234567890"
                @keydown.enter.prevent="addParserChat('telegram')"
              />
              <button type="button" class="rounded border border-gray-300 px-3 py-2 text-xs hover:bg-gray-50" @click="addParserChat('telegram')">Добавить</button>
            </div>
          </div>
          <div class="space-y-2 text-sm">
            <span class="font-medium text-gray-700">MAX parser source chats</span>
            <div class="flex flex-wrap gap-2">
              <span v-for="chat in settingsForm.maxParserSourceChats" :key="`max-${chat}`" class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-mono text-emerald-800">
                {{ chat }}
                <button type="button" class="text-emerald-700 hover:text-emerald-900" @click="removeParserChat('max', chat)">×</button>
              </span>
              <span v-if="!settingsForm.maxParserSourceChats.length" class="text-xs text-gray-500">Список пуст</span>
            </div>
            <div class="flex gap-2">
              <input
                v-model="settingsForm.maxParserSourceInput"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs"
                placeholder="conversation_id"
                @keydown.enter.prevent="addParserChat('max')"
              />
              <button type="button" class="rounded border border-gray-300 px-3 py-2 text-xs hover:bg-gray-50" @click="addParserChat('max')">Добавить</button>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50" :disabled="settingsLoading" @click="saveSettings">
              {{ settingsLoading ? 'Сохраняем...' : 'Сохранить настройки города' }}
            </button>
            <span v-if="settingsMessage" class="text-sm text-gray-700">{{ settingsMessage }}</span>
          </div>

          <div class="rounded border border-gray-200 p-3">
            <p class="text-sm font-medium text-gray-800">Быстрая привязка чатов через бота</p>
            <p class="mt-1 text-xs text-gray-500">Сгенерируйте ссылку, откройте ее в боте, затем отправьте команду в нужной группе/чате.</p>
            <div class="mt-2 flex flex-wrap gap-2">
              <button class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50" @click="generateChatLink('telegram','manager')">TG manager</button>
              <button class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50" @click="generateChatLink('telegram','moderation')">TG moderation</button>
              <button class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50" @click="generateChatLink('telegram','parser_source')">TG parser source</button>
              <button class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50" @click="generateChatLink('max','manager')">MAX manager</button>
              <button class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50" @click="generateChatLink('max','moderation')">MAX moderation</button>
              <button class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50" @click="generateChatLink('max','parser_source')">MAX parser source</button>
            </div>
            <div v-if="chatLinkResult" class="mt-3 space-y-1 text-xs">
              <p><span class="font-medium">Deep link:</span> <a class="text-primary underline" :href="chatLinkResult.deepLink" target="_blank">{{ chatLinkResult.deepLink }}</a></p>
              <p><span class="font-medium">Команда:</span> <code class="rounded bg-gray-100 px-1">{{ chatLinkResult.bindCommand }}</code></p>
              <p><span class="font-medium">Истекает:</span> {{ chatLinkResult.tokenExpiresAt }}</p>
            </div>
          </div>
        </article>

        <DashboardIngestSourcesPanel v-if="selectedCitySlug" :city-slug="selectedCitySlug" />

        <article class="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
          <h2 class="text-lg font-semibold">AI parse / ingest тест</h2>
          <label class="block space-y-1 text-sm">
            <span class="font-medium text-gray-700">Source kind</span>
            <select v-model="aiForm.sourceKind" class="w-full rounded-lg border border-gray-300 px-3 py-2">
              <option value="telegram_parse">telegram_parse</option>
              <option value="web_cron">web_cron</option>
              <option value="bot_submit">bot_submit</option>
              <option value="manual_editor">manual_editor</option>
            </select>
          </label>
          <label class="block space-y-1 text-sm">
            <span class="font-medium text-gray-700">Source URL</span>
            <input v-model="aiForm.sourceUrl" class="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <label class="block space-y-1 text-sm">
            <span class="font-medium text-gray-700">Raw text</span>
            <textarea v-model="aiForm.rawText" rows="8" class="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>

          <div class="flex flex-wrap items-center gap-3">
            <button class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50" :disabled="aiLoading" @click="runParseOnly">
              Parse only
            </button>
            <button class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50" :disabled="aiLoading" @click="runIngest(false)">
              Ingest (без persist)
            </button>
            <button class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50" :disabled="aiLoading" @click="runIngest(true)">
              Ingest + persist
            </button>
          </div>

          <pre class="max-h-80 overflow-auto rounded-lg bg-gray-900 p-3 text-xs text-gray-100">{{ aiResultText }}</pre>
        </article>
      </div>

      <article v-if="selectedCitySlug" id="editorial-journal" class="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div class="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 class="text-lg font-semibold">Журнал города</h2>
            <p class="text-xs text-gray-500">Материалы на витрине /guides — новости, гиды и лонгриды.</p>
          </div>
          <div class="flex flex-wrap items-end gap-2">
            <NuxtLink
              v-if="selectedCitySlug"
              :to="`/dashboard/carousel-studio?city=${encodeURIComponent(selectedCitySlug)}`"
              class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              Карусель PNG
            </NuxtLink>
            <button
              type="button"
              class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              @click="startCreateEditorial"
            >
              Создать материал
            </button>
            <label class="space-y-1 text-sm">
              <span class="font-medium text-gray-700">Статус</span>
              <select
                v-model="editorialStatusFilter"
                class="rounded-lg border border-gray-300 px-3 py-2"
                @change="loadEditorialPosts"
              >
                <option value="all">Все</option>
                <option value="published">Опубликованные</option>
                <option value="draft">Черновики</option>
              </select>
            </label>
          </div>
        </div>

        <div
          v-if="showEditorialForm"
          id="editorial-create-form"
          class="space-y-3 rounded-lg border border-dashed border-gray-300 bg-gray-50/60 p-4"
        >
          <h3 class="text-sm font-semibold text-gray-800">
            {{ editingPostId ? 'Редактирование материала' : 'Новый материал журнала' }}
          </h3>
          <div class="grid gap-3 md:grid-cols-2">
            <label class="space-y-1 text-sm md:col-span-2">
              <span class="font-medium text-gray-700">Заголовок</span>
              <input
                ref="editorialTitleInput"
                v-model="newsForm.title"
                class="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </label>
            <label class="space-y-1 text-sm md:col-span-2">
              <span class="font-medium text-gray-700">Текст</span>
              <textarea v-model="newsForm.body" rows="6" class="w-full rounded-lg border border-gray-300 px-3 py-2" />
            </label>
            <label class="space-y-1 text-sm">
              <span class="font-medium text-gray-700">Краткое описание (optional)</span>
              <input v-model="newsForm.excerpt" class="w-full rounded-lg border border-gray-300 px-3 py-2" />
            </label>
            <div class="space-y-2 text-sm md:col-span-2">
              <span class="font-medium text-gray-700">Обложка (optional)</span>
              <div v-if="newsForm.coverMediaUrl" class="relative max-w-xs overflow-hidden rounded-lg border border-gray-200">
                <img
                  :src="newsForm.coverMediaUrl"
                  alt="Превью обложки"
                  class="aspect-[4/3] w-full object-cover"
                >
                <button
                  type="button"
                  class="absolute right-2 top-2 rounded bg-white/90 px-2 py-0.5 text-xs text-gray-700 shadow hover:bg-white"
                  @click="newsForm.coverMediaUrl = ''"
                >
                  Удалить
                </button>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <label class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    class="sr-only"
                    :disabled="coverUploadLoading"
                    @change="onEditorialCoverFile"
                  >
                  {{ coverUploadLoading ? 'Загрузка…' : 'Загрузить файл' }}
                </label>
                <span class="text-xs text-gray-500">PNG, JPEG, WebP, GIF · до 8 MB · сжатие в WebP</span>
              </div>
              <label class="block space-y-1">
                <span class="text-xs text-gray-500">или вставьте URL</span>
                <input
                  v-model="newsForm.coverMediaUrl"
                  type="url"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="https://…"
                >
              </label>
            </div>
            <div class="md:col-span-2">
              <DashboardTaxonomyPicker
                v-model="newsForm.categorySlug"
                :city-slug="selectedCitySlug"
                kind="category"
                label="Категория"
                placeholder="Поиск категории…"
              />
            </div>
            <div class="md:col-span-2">
              <DashboardTaxonomyPicker
                v-model="newsForm.topicTags"
                :city-slug="selectedCitySlug"
                kind="tags"
                label="Теги"
                placeholder="Поиск или новый тег…"
                hint="Enter — выбрать; «+ Создать» — добавить в справочник города"
              />
            </div>
          </div>

          <label v-if="!editingPostId" class="inline-flex items-center gap-2 text-sm text-gray-700">
            <input v-model="newsForm.publishNow" type="checkbox" />
            Опубликовать сразу
          </label>

          <div class="flex flex-wrap items-center gap-3">
            <button
              type="button"
              class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
              :disabled="newsLoading"
              @click="saveEditorialNews"
            >
              {{ newsLoading ? 'Сохраняем...' : (editingPostId ? 'Сохранить изменения' : 'Создать материал') }}
            </button>
            <button
              type="button"
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
              @click="cancelEditorialForm"
            >
              Отмена
            </button>
            <span v-if="newsMessage" class="text-sm text-gray-700">{{ newsMessage }}</span>
          </div>
        </div>

        <div v-if="editorialListLoading" class="text-sm text-gray-500">Загрузка журнала…</div>
        <div v-else-if="!editorialPosts.length" class="rounded-lg border border-dashed border-gray-200 p-4 text-center">
          <p class="text-sm text-gray-600">Материалов пока нет. Создайте первый материал для блока «Журнал» на главной города.</p>
          <button
            type="button"
            class="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            @click="startCreateEditorial"
          >
            Создать материал
          </button>
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="post in editorialPosts"
            :key="post.id"
            class="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50/80 p-3"
          >
            <div class="min-w-0 flex-1 space-y-1">
              <p class="font-medium text-gray-900">{{ post.title }}</p>
              <p class="text-xs text-gray-500">
                <span
                  class="inline-flex rounded-full px-2 py-0.5"
                  :class="post.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'"
                >
                  {{ post.is_published ? 'Опубликован' : 'Черновик' }}
                </span>
                <span v-if="post.published_at" class="ml-2">{{ formatEditorialDate(post.published_at) }}</span>
              </p>
              <a
                v-if="post.is_published"
                :href="`/${selectedCitySlug}/guides/${post.slug}`"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs font-medium text-primary hover:underline"
              >
                На витрине →
              </a>
              <div v-if="selectedCitySlug" class="mt-2 flex flex-wrap gap-2">
                <NuxtLink
                  :to="`/dashboard/carousel-studio?city=${encodeURIComponent(selectedCitySlug)}&post=${post.id}`"
                  class="text-xs font-medium text-primary hover:underline"
                >
                  Редактировать карусель
                </NuxtLink>
              </div>
              <EditorialCarouselExportPanel
                v-if="editorialCarouselForPost(post)"
                class="mt-2"
                :carousel="editorialCarouselForPost(post)!"
                :brand-name="selectedCityName"
                :topic-tags="post.topic_tags || []"
                :link-hint="`/${selectedCitySlug}/guides/${post.slug}`"
              />
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-white"
                @click="startEditPost(post)"
              >
                Редактировать
              </button>
              <button
                v-if="!post.is_published"
                type="button"
                class="rounded border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"
                :disabled="newsLoading"
                @click="setEditorialPublishState(post.id, true)"
              >
                Опубликовать
              </button>
              <button
                v-else
                type="button"
                class="rounded border border-amber-300 bg-amber-50 px-2 py-1 text-xs text-amber-900 hover:bg-amber-100 disabled:opacity-50"
                :disabled="newsLoading"
                @click="setEditorialPublishState(post.id, false)"
              >
                Снять с публикации
              </button>
            </div>
          </div>
        </div>
      </article>

      <article class="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <h2 class="text-lg font-semibold">Ручной запуск дайджестов/подборок</h2>
        <p class="text-xs text-gray-500">
          Создает draft-подборки (`is_published=false`) и отправляет уведомление в manager/moderation chat.
        </p>
        <div class="grid gap-3 md:grid-cols-2">
          <label class="space-y-1 text-sm">
            <span class="font-medium text-gray-700">Режим</span>
            <select v-model="digestForm.mode" class="w-full rounded-lg border border-gray-300 px-3 py-2">
              <option value="weekly">weekly</option>
              <option value="custom">custom</option>
            </select>
          </label>
          <label class="space-y-1 text-sm">
            <span class="font-medium text-gray-700">Tag mode</span>
            <select v-model="digestForm.tagsMode" class="w-full rounded-lg border border-gray-300 px-3 py-2">
              <option value="or">or</option>
              <option value="and">and</option>
            </select>
          </label>
          <label class="space-y-1 text-sm">
            <span class="font-medium text-gray-700">Лимит карточек</span>
            <input v-model.number="digestForm.limit" type="number" min="3" max="20" class="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <label class="space-y-1 text-sm">
            <span class="font-medium text-gray-700">Мин. editorial score</span>
            <input v-model.number="digestForm.minScore" type="number" min="1" max="5" class="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <div v-if="selectedCitySlug" class="space-y-1 text-sm md:col-span-2">
            <DashboardTaxonomyPicker
              v-model="digestForm.categorySlug"
              :city-slug="selectedCitySlug"
              kind="category"
              label="Категория (optional)"
              placeholder="Поиск категории…"
            />
          </div>
          <div v-if="selectedCitySlug" class="space-y-1 text-sm md:col-span-2">
            <DashboardTaxonomyPicker
              v-model="digestForm.topicTags"
              :city-slug="selectedCitySlug"
              kind="tags"
              label="Теги (клик + поиск)"
              placeholder="Поиск или новый тег…"
              hint="Кликайте по тегам из списка или ищите по названию"
            />
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50" :disabled="digestLoading" @click="runDigestGeneration">
            {{ digestLoading ? 'Запуск...' : 'Запустить генерацию' }}
          </button>
          <span v-if="digestMessage" class="text-sm text-gray-700">{{ digestMessage }}</span>
        </div>
        <pre class="max-h-72 overflow-auto rounded-lg bg-gray-900 p-3 text-xs text-gray-100">{{ digestResultText }}</pre>
      </article>

      <article class="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div class="flex items-center justify-between gap-3">
          <h2 class="text-lg font-semibold">Очередь контента (модерация)</h2>
          <div class="flex items-center gap-2">
            <select v-model="queueStatus" class="rounded-lg border border-gray-300 px-2 py-1 text-sm" @change="loadQueue">
              <option value="pending">pending</option>
              <option value="needs_revision">needs_revision</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
              <option value="all">all</option>
            </select>
            <select v-model="queueKind" class="rounded-lg border border-gray-300 px-2 py-1 text-sm" @change="loadQueue">
              <option value="">все типы</option>
              <option value="event">события</option>
              <option value="event_digest">digest-пакеты</option>
            </select>
            <button class="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50" @click="loadQueue">Обновить</button>
          </div>
        </div>
        <p v-if="queueMessage" class="text-sm text-gray-700">{{ queueMessage }}</p>
        <div v-if="!queueItems.length" class="rounded border border-dashed border-gray-300 p-3 text-sm text-gray-600">
          Очередь пуста или еще не создана таблица `content_submissions`.
        </div>
        <div v-else class="space-y-3">
          <article v-for="item in queueItems" :key="item.id" class="rounded border border-gray-200 p-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p class="text-sm font-medium">
                  <span v-if="item.kind === 'event_digest' || item.batchRole === 'batch'" class="mr-1 rounded bg-violet-100 px-1.5 py-0.5 text-xs text-violet-800">digest</span>
                  {{ item.payload?.title || item.payload?.digest?.title || (item.eventsCount ? `Пакет · ${item.eventsCount} событий` : 'Без заголовка') }}
                </p>
                <p class="font-mono text-xs text-gray-500">{{ item.id }}</p>
                <p class="text-xs text-gray-600">
                  status: {{ item.status }} · kind: {{ item.kind }} · score: {{ item.editorialScore ?? '—' }} · откуда: {{ item.sourceIntakeLabel ?? item.sourceKind ?? '—' }}
                  <span v-if="item.batchRole"> · batch: {{ item.batchRole }}<span v-if="item.batchIndex != null"> #{{ item.batchIndex }}</span></span>
                </p>
                <ul v-if="item.batchRole === 'batch' && Array.isArray(item.payload?.events)" class="mt-2 space-y-0.5 text-xs text-gray-600">
                  <li v-for="(ev, idx) in item.payload.events.slice(0, 8)" :key="idx">
                    {{ idx + 1 }}. {{ ev.title }} · {{ (ev.recurrence?.dates?.[0] || '—').slice(0, 16) }}
                  </li>
                  <li v-if="item.payload.events.length > 8" class="text-gray-400">… ещё {{ item.payload.events.length - 8 }}</li>
                </ul>
                <p v-if="item.payload?.description_short" class="mt-1 text-xs text-gray-600">
                  <span class="font-medium">Кратко:</span> {{ item.payload.description_short }}
                </p>
                <p v-if="item.payload?.description_full" class="mt-1 text-xs text-gray-500 line-clamp-3">
                  <span class="font-medium">Полностью:</span> {{ item.payload.description_full }}
                </p>
                <img
                  v-if="item.payload?.cover_media_url"
                  :src="item.payload.cover_media_url"
                  alt=""
                  class="mt-2 max-h-24 rounded border border-gray-200 object-cover"
                />
              </div>
              <div class="flex flex-wrap gap-2">
                <button class="rounded border border-green-300 px-2 py-1 text-xs text-green-700 hover:bg-green-50" @click="queueAction(item.id, 'approve')">Approve</button>
                <button class="rounded border border-amber-300 px-2 py-1 text-xs text-amber-700 hover:bg-amber-50" @click="queueAction(item.id, 'needs_revision')">Need revision</button>
                <button class="rounded border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50" @click="queueAction(item.id, 'reject')">Reject</button>
                <button class="rounded border border-blue-300 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50" @click="notifyQueueTelegram(item.id)">В TG чат</button>
                <button
                  v-if="item.status === 'approved'"
                  class="rounded border border-indigo-300 px-2 py-1 text-xs text-indigo-700 hover:bg-indigo-50"
                  @click="publishQueueToSite(item.id)"
                >
                  На сайт
                </button>
              </div>
            </div>
            <div v-if="item.batchRole !== 'batch'" class="mt-3 grid gap-2 md:grid-cols-2">
              <label class="space-y-1 text-xs">
                <span class="font-medium text-gray-700">Title</span>
                <input v-model="queueEdits[item.id].title" class="w-full rounded border border-gray-300 px-2 py-1 text-sm" />
              </label>
              <div v-if="selectedCitySlug" class="space-y-1 text-xs">
                <DashboardTaxonomyPicker
                  v-model="queueEdits[item.id].categorySlug"
                  :city-slug="selectedCitySlug"
                  kind="category"
                  label="Категория"
                  placeholder="Поиск категории…"
                />
              </div>
              <label class="space-y-1 text-xs md:col-span-2">
                <span class="font-medium text-gray-700">Краткое описание</span>
                <textarea v-model="queueEdits[item.id].descriptionShort" rows="2" class="w-full rounded border border-gray-300 px-2 py-1 text-sm" />
              </label>
              <label class="space-y-1 text-xs md:col-span-2">
                <span class="font-medium text-gray-700">Полное описание</span>
                <textarea v-model="queueEdits[item.id].descriptionFull" rows="4" class="w-full rounded border border-gray-300 px-2 py-1 text-sm" />
              </label>
              <label class="space-y-1 text-xs">
                <span class="font-medium text-gray-700">Registration URL</span>
                <input v-model="queueEdits[item.id].registrationUrl" class="w-full rounded border border-gray-300 px-2 py-1 text-sm" />
              </label>
              <div v-if="selectedCitySlug" class="space-y-1 text-xs md:col-span-2">
                <DashboardTaxonomyPicker
                  v-model="queueEdits[item.id].topicTags"
                  :city-slug="selectedCitySlug"
                  kind="tags"
                  label="Теги"
                  placeholder="Поиск или новый тег…"
                />
              </div>
            </div>
            <div class="mt-2 flex flex-wrap items-center gap-2">
              <button class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50" @click="saveQueueEdit(item.id)">Save edit</button>
              <button
                v-for="score in [1,2,3,4,5]"
                :key="`${item.id}-score-${score}`"
                class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
                @click="queueAction(item.id, 'score', score)"
              >
                ⭐{{ score }}
              </button>
            </div>
          </article>
        </div>
      </article>
    </template>
  </section>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, watch } from 'vue'

declare const definePageMeta: (meta: Record<string, unknown>) => void
definePageMeta({ layout: 'dashboard' })

type ManagerCityItem = {
  citySlug: string
  cityName: string
}

const { dashboardFetch } = useDashboardFetch()

const managerCities = ref<ManagerCityItem[]>([])
const selectedCitySlug = ref('')
const selectedCityName = computed(
  () => managerCities.value.find((c) => c.citySlug === selectedCitySlug.value)?.cityName || 'INUU',
)
const loadingCities = ref(true)

const settingsLoading = ref(false)
const settingsMessage = ref('')
const chatLinkResult = ref<{ deepLink: string; bindCommand: string; tokenExpiresAt: string } | null>(null)
const settingsForm = reactive({
  telegramManagerChatId: '',
  telegramModerationChatId: '',
  telegramParserSourceChats: [] as string[],
  telegramParserSourceInput: '',
  maxManagerChatId: '',
  maxModerationChatId: '',
  maxParserSourceChats: [] as string[],
  maxParserSourceInput: '',
})

const aiLoading = ref(false)
const aiResultText = ref('Пока пусто')
const aiForm = reactive({
  sourceKind: 'telegram_parse',
  sourceUrl: '',
  rawText: 'В субботу 15 июня в 19:00 пройдет гончарный мастер-класс в Арт-квартале. 12 мест, стоимость 1500 руб. Запись по ссылке https://example.com/register',
})

const newsLoading = ref(false)
const newsMessage = ref('')
const editingPostId = ref('')
const showEditorialForm = ref(false)
const editorialTitleInput = ref<HTMLInputElement | null>(null)
const coverUploadLoading = ref(false)
const editorialPosts = ref<Array<{
  id: string
  slug: string
  title: string
  excerpt: string | null
  body: string
  cover_media_url: string | null
  topic_tags: string[] | null
  category_slug: string | null
  is_published: boolean
  published_at: string | null
  metadata?: Record<string, unknown> | null
}>>([])
const editorialStatusFilter = ref<'all' | 'published' | 'draft'>('all')
const editorialListLoading = ref(false)
const newsForm = reactive({
  title: '',
  body: '',
  excerpt: '',
  coverMediaUrl: '',
  publishNow: false,
  categorySlug: '' as string,
  topicTags: [] as string[],
})

const digestLoading = ref(false)
const digestMessage = ref('')
const digestResultText = ref('Пока пусто')
const digestForm = reactive({
  mode: 'weekly' as 'weekly' | 'custom',
  tagsMode: 'or' as 'or' | 'and',
  limit: 12,
  minScore: 4,
  categorySlug: '',
  topicTags: [] as string[],
})

const queueStatus = ref('pending')
const queueKind = ref('')
const queueItems = ref<any[]>([])
const queueMessage = ref('')
const queueEdits = reactive<Record<string, {
  title: string
  descriptionShort: string
  descriptionFull: string
  categorySlug: string
  registrationUrl: string
  topicTags: string[]
}>>({})

function pretty(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

async function loadManagerCities() {
  loadingCities.value = true
  try {
    const res = await dashboardFetch('/api/dashboard/manager/cities')
    const payload = await res.json() as { ok: boolean; items: Array<{ citySlug: string; cityName: string }> }
    managerCities.value = payload.ok ? payload.items : []
    if (!selectedCitySlug.value && managerCities.value.length) {
      selectedCitySlug.value = managerCities.value[0].citySlug
    }
  } finally {
    loadingCities.value = false
  }
}

async function loadSettings() {
  if (!selectedCitySlug.value) return
  settingsLoading.value = true
  settingsMessage.value = ''
  try {
    const res = await dashboardFetch(`/api/dashboard/manager/cities/${selectedCitySlug.value}/content-settings`)
    const payload = await res.json() as any
    const settings = payload?.settings || {}
    settingsForm.telegramManagerChatId = settings?.telegram?.manager_chat_id || ''
    settingsForm.telegramModerationChatId = settings?.telegram?.moderation_chat_id || ''
    settingsForm.telegramParserSourceChats = Array.isArray(settings?.telegram?.parser_source_chats)
      ? settings.telegram.parser_source_chats.map((x: unknown) => String(x || '').trim()).filter(Boolean)
      : []
    settingsForm.telegramParserSourceInput = ''
    settingsForm.maxManagerChatId = settings?.max?.manager_chat_id || ''
    settingsForm.maxModerationChatId = settings?.max?.moderation_chat_id || ''
    settingsForm.maxParserSourceChats = Array.isArray(settings?.max?.parser_source_chats)
      ? settings.max.parser_source_chats.map((x: unknown) => String(x || '').trim()).filter(Boolean)
      : []
    settingsForm.maxParserSourceInput = ''
  } catch (error: any) {
    settingsMessage.value = error?.data?.statusMessage || error?.message || 'Не удалось загрузить настройки'
  } finally {
    settingsLoading.value = false
  }
}

async function saveSettings() {
  if (!selectedCitySlug.value) return
  settingsLoading.value = true
  settingsMessage.value = ''
  try {
    const res = await dashboardFetch(`/api/dashboard/manager/cities/${selectedCitySlug.value}/content-settings`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        telegramManagerChatId: settingsForm.telegramManagerChatId,
        telegramModerationChatId: settingsForm.telegramModerationChatId,
        telegramParserSourceChats: settingsForm.telegramParserSourceChats,
        maxManagerChatId: settingsForm.maxManagerChatId,
        maxModerationChatId: settingsForm.maxModerationChatId,
        maxParserSourceChats: settingsForm.maxParserSourceChats,
      }),
    })
    if (!res.ok) throw new Error('Не удалось сохранить настройки')
    settingsMessage.value = 'Сохранено'
  } catch (error: any) {
    settingsMessage.value = error?.data?.statusMessage || error?.message || 'Ошибка сохранения'
  } finally {
    settingsLoading.value = false
  }
}

function addParserChat(channel: 'telegram' | 'max') {
  const isTelegram = channel === 'telegram'
  const input = isTelegram ? settingsForm.telegramParserSourceInput : settingsForm.maxParserSourceInput
  const value = String(input || '').trim()
  if (!value) return
  if (isTelegram) {
    if (!settingsForm.telegramParserSourceChats.includes(value)) {
      settingsForm.telegramParserSourceChats.push(value)
    }
    settingsForm.telegramParserSourceInput = ''
    return
  }
  if (!settingsForm.maxParserSourceChats.includes(value)) {
    settingsForm.maxParserSourceChats.push(value)
  }
  settingsForm.maxParserSourceInput = ''
}

function removeParserChat(channel: 'telegram' | 'max', value: string) {
  if (channel === 'telegram') {
    settingsForm.telegramParserSourceChats = settingsForm.telegramParserSourceChats.filter((x: string) => x !== value)
    return
  }
  settingsForm.maxParserSourceChats = settingsForm.maxParserSourceChats.filter((x: string) => x !== value)
}

async function generateChatLink(channel: 'telegram' | 'max', target: 'manager' | 'moderation' | 'parser_source') {
  if (!selectedCitySlug.value) return
  settingsMessage.value = ''
  chatLinkResult.value = null
  try {
    const res = await dashboardFetch(`/api/dashboard/manager/cities/${selectedCitySlug.value}/chat-link-token`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ channel, target }),
    })
    const payload = await res.json() as any
    if (!res.ok || payload?.ok === false) {
      throw new Error(payload?.statusMessage || payload?.message || 'Не удалось сгенерировать ссылку')
    }
    chatLinkResult.value = {
      deepLink: String(payload.deepLink || ''),
      bindCommand: String(payload.bindCommand || ''),
      tokenExpiresAt: String(payload.tokenExpiresAt || ''),
    }
    settingsMessage.value = `Ссылка готова (${channel}/${target})`
  } catch (error: any) {
    settingsMessage.value = error?.data?.statusMessage || error?.message || 'Ошибка генерации ссылки'
  }
}

async function runParseOnly() {
  if (!selectedCitySlug.value) return
  aiLoading.value = true
  try {
    const res = await dashboardFetch('/api/ai/parse-event', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        rawText: aiForm.rawText,
        sourceKind: aiForm.sourceKind,
        sourceUrl: aiForm.sourceUrl || null,
        citySlug: selectedCitySlug.value,
      }),
    })
    const response = await res.json()
    aiResultText.value = pretty(response)
  } catch (error: any) {
    aiResultText.value = pretty(error?.data || error?.message || error)
  } finally {
    aiLoading.value = false
  }
}

async function runIngest(persist: boolean) {
  if (!selectedCitySlug.value) return
  aiLoading.value = true
  try {
    const res = await dashboardFetch('/api/ingest/content/submit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        rawText: aiForm.rawText,
        sourceKind: aiForm.sourceKind,
        sourceUrl: aiForm.sourceUrl || null,
        citySlug: selectedCitySlug.value,
        persist,
      }),
    })
    const response = await res.json()
    aiResultText.value = pretty(response)
  } catch (error: any) {
    aiResultText.value = pretty(error?.data || error?.message || error)
  } finally {
    aiLoading.value = false
  }
}

function editorialCarouselForPost(post: (typeof editorialPosts.value)[number]) {
  const raw = post.metadata?.carousel
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const meta = raw as { slides?: unknown[] }
  if (!Array.isArray(meta.slides) || meta.slides.length < 2) return null
  return raw as {
    template_id: 'minimal-ios'
    aspect: '4:5' | '9:16'
    slides: Array<Record<string, unknown>>
  }
}

function formatEditorialDate(value: string): string {
  try {
    return new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
  } catch {
    return value
  }
}

function resetNewsForm() {
  editingPostId.value = ''
  newsForm.title = ''
  newsForm.body = ''
  newsForm.excerpt = ''
  newsForm.coverMediaUrl = ''
  newsForm.publishNow = false
  newsForm.categorySlug = ''
  newsForm.topicTags = []
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const value = String(reader.result || '')
      const marker = 'base64,'
      const idx = value.indexOf(marker)
      if (idx === -1) reject(new Error('Не удалось прочитать файл'))
      else resolve(value.slice(idx + marker.length))
    }
    reader.onerror = () => reject(reader.error || new Error('Не удалось прочитать файл'))
    reader.readAsDataURL(file)
  })
}

async function onEditorialCoverFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file || !selectedCitySlug.value) return
  if (file.size > 8 * 1024 * 1024) {
    newsMessage.value = 'Файл больше 8 MB'
    return
  }
  coverUploadLoading.value = true
  newsMessage.value = ''
  try {
    const res = await dashboardFetch(
      `/api/dashboard/manager/cities/${selectedCitySlug.value}/editorial-cover/upload`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          dataBase64: await fileToBase64(file),
        }),
      },
    )
    const payload = await res.json() as { ok?: boolean; url?: string; statusMessage?: string; message?: string }
    if (!res.ok || !payload?.ok || !payload.url) {
      throw new Error(payload?.statusMessage || payload?.message || 'Не удалось загрузить обложку')
    }
    newsForm.coverMediaUrl = payload.url
    newsMessage.value = 'Обложка загружена'
  } catch (error: any) {
    newsMessage.value = error?.data?.statusMessage || error?.message || 'Ошибка загрузки обложки'
  } finally {
    coverUploadLoading.value = false
  }
}

async function startCreateEditorial() {
  resetNewsForm()
  newsMessage.value = ''
  showEditorialForm.value = true
  await nextTick()
  editorialTitleInput.value?.focus()
  document.getElementById('editorial-create-form')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

function cancelEditorialForm() {
  resetNewsForm()
  newsMessage.value = ''
  showEditorialForm.value = false
}

function editorialPayload(extra?: { isPublished?: boolean }) {
  return {
    title: newsForm.title,
    body: newsForm.body,
    excerpt: newsForm.excerpt || null,
    coverMediaUrl: newsForm.coverMediaUrl || null,
    categorySlug: newsForm.categorySlug || null,
    topicTags: newsForm.topicTags,
    ...(extra?.isPublished !== undefined
      ? { isPublished: extra.isPublished }
      : { publishNow: newsForm.publishNow }),
  }
}

async function loadEditorialPosts() {
  if (!selectedCitySlug.value) return
  editorialListLoading.value = true
  try {
    const res = await dashboardFetch(
      `/api/dashboard/manager/cities/${selectedCitySlug.value}/editorial-news?status=${encodeURIComponent(editorialStatusFilter.value)}&limit=50`,
    )
    const payload = await res.json() as any
    editorialPosts.value = payload?.ok ? payload.items || [] : []
  } catch {
    editorialPosts.value = []
  } finally {
    editorialListLoading.value = false
  }
}

async function startEditPost(post: (typeof editorialPosts.value)[number]) {
  editingPostId.value = post.id
  newsForm.title = post.title
  newsForm.body = post.body
  newsForm.excerpt = post.excerpt || ''
  newsForm.coverMediaUrl = post.cover_media_url || ''
  newsForm.categorySlug = post.category_slug || ''
  newsForm.topicTags = Array.isArray(post.topic_tags) ? [...post.topic_tags] : []
  newsForm.publishNow = false
  newsMessage.value = ''
  showEditorialForm.value = true
  await nextTick()
  document.getElementById('editorial-create-form')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

async function saveEditorialNews() {
  if (!selectedCitySlug.value) return
  newsLoading.value = true
  newsMessage.value = ''
  try {
    const isEdit = Boolean(editingPostId.value)
    const url = isEdit
      ? `/api/dashboard/manager/cities/${selectedCitySlug.value}/editorial-news/${editingPostId.value}`
      : `/api/dashboard/manager/cities/${selectedCitySlug.value}/editorial-news`
    const res = await dashboardFetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(editorialPayload()),
    })
    const response = await res.json() as any
    if (!res.ok || response?.ok === false) {
      throw new Error(response?.statusMessage || response?.message || 'Ошибка сохранения')
    }
    const path = response?.publicPath ? ` · ${response.publicPath}` : ''
    newsMessage.value = isEdit ? `Сохранено${path}` : `Материал создан${path}`
    if (!isEdit) {
      resetNewsForm()
      showEditorialForm.value = false
    }
    await loadEditorialPosts()
  } catch (error: any) {
    newsMessage.value = error?.data?.statusMessage || error?.message || 'Ошибка сохранения материала'
  } finally {
    newsLoading.value = false
  }
}

async function setEditorialPublishState(postId: string, isPublished: boolean) {
  if (!selectedCitySlug.value) return
  newsLoading.value = true
  newsMessage.value = ''
  try {
    const post = editorialPosts.value.find((row) => row.id === postId)
    const res = await dashboardFetch(
      `/api/dashboard/manager/cities/${selectedCitySlug.value}/editorial-news/${postId}`,
      {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title: post?.title,
          body: post?.body,
          excerpt: post?.excerpt,
          coverMediaUrl: post?.cover_media_url,
          categorySlug: post?.category_slug,
          topicTags: post?.topic_tags || [],
          isPublished,
        }),
      },
    )
    const response = await res.json() as any
    if (!res.ok || response?.ok === false) {
      throw new Error(response?.statusMessage || response?.message || 'Ошибка публикации')
    }
    newsMessage.value = isPublished
      ? `Опубликовано${response?.publicPath ? `: ${response.publicPath}` : ''}`
      : 'Снято с публикации'
    if (editingPostId.value === postId && !isPublished) {
      newsForm.publishNow = false
    }
    await loadEditorialPosts()
  } catch (error: any) {
    newsMessage.value = error?.data?.statusMessage || error?.message || 'Не удалось изменить статус'
  } finally {
    newsLoading.value = false
  }
}

function hydrateQueueEdit(item: any) {
  const p = item?.payload || {}
  queueEdits[item.id] = {
    title: String(p.title || ''),
    descriptionShort: String(p.description_short || p.description || '').slice(0, 280),
    descriptionFull: String(p.description_full || p.description || ''),
    categorySlug: String(item?.payload?.category_slug || ''),
    registrationUrl: String(item?.payload?.registration_url || ''),
    topicTags: Array.isArray(item?.payload?.topic_tags)
      ? item.payload.topic_tags.map((x: unknown) => String(x || '').trim()).filter(Boolean)
      : [],
  }
}

async function loadQueue() {
  if (!selectedCitySlug.value) return
  queueMessage.value = ''
  try {
    const kindQuery = queueKind.value ? `&kind=${encodeURIComponent(queueKind.value)}` : ''
    const res = await dashboardFetch(`/api/dashboard/manager/cities/${selectedCitySlug.value}/content-queue?status=${encodeURIComponent(queueStatus.value)}&limit=50${kindQuery}`)
    const payload = await res.json() as any
    if (!res.ok) {
      queueItems.value = []
      queueMessage.value = res.status === 401
        ? 'Сессия истекла — войдите в кабинет снова (/dashboard/login).'
        : (payload?.statusMessage || payload?.message || `Ошибка ${res.status}`)
      return
    }
    queueItems.value = payload?.ok ? payload.items || [] : []
    for (const item of queueItems.value) hydrateQueueEdit(item)
    if (!payload?.ok && payload?.message) {
      queueMessage.value = payload.message
    }
  } catch (error: any) {
    queueItems.value = []
    queueMessage.value = error?.data?.statusMessage || error?.message || 'Не удалось загрузить очередь'
  }
}

async function queueAction(submissionId: string, action: 'approve' | 'reject' | 'needs_revision' | 'score', score?: number) {
  if (!selectedCitySlug.value) return
  queueMessage.value = ''
  try {
    const res = await dashboardFetch(`/api/dashboard/manager/cities/${selectedCitySlug.value}/content-queue/action`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ submissionId, action, score }),
    })
    const payload = await res.json() as any
    if (!res.ok || payload?.ok === false) throw new Error(payload?.statusMessage || payload?.message || 'Action failed')
    if (action === 'approve' && payload?.published?.entitySlug) {
      const path = payload.published.publicPath || ''
      queueMessage.value = payload.published.alreadyPublished
        ? `Уже опубликовано: ${path || payload.published.entitySlug}`
        : `Опубликовано на сайте${path ? `: ${path}` : ''}`
    } else if (action === 'approve') {
      queueMessage.value = 'Одобрено и опубликовано'
    } else {
      queueMessage.value = `Действие ${action} применено`
    }
    await loadQueue()
  } catch (error: any) {
    queueMessage.value = error?.data?.statusMessage || error?.message || 'Не удалось выполнить действие'
  }
}

async function publishQueueToSite(submissionId: string) {
  if (!selectedCitySlug.value) return
  queueMessage.value = ''
  try {
    const res = await dashboardFetch(
      `/api/dashboard/manager/cities/${selectedCitySlug.value}/content-queue/${submissionId}/publish`,
      { method: 'POST' },
    )
    const payload = await res.json() as any
    if (!res.ok || payload?.ok === false) {
      throw new Error(payload?.statusMessage || payload?.message || 'Не удалось опубликовать')
    }
    const path = payload?.published?.publicPath
    queueMessage.value = payload?.published?.alreadyPublished
      ? `Уже на сайте${path ? `: ${path}` : ''}`
      : `Опубликовано${path ? `: ${path}` : ''}`
    await loadQueue()
  } catch (error: any) {
    queueMessage.value = error?.data?.statusMessage || error?.message || 'Ошибка публикации на сайт'
  }
}

async function notifyQueueTelegram(submissionId: string) {
  if (!selectedCitySlug.value) return
  queueMessage.value = ''
  try {
    const res = await dashboardFetch(
      `/api/dashboard/manager/cities/${selectedCitySlug.value}/content-queue/${submissionId}/notify-telegram`,
      { method: 'POST' },
    )
    const payload = await res.json() as any
    if (!res.ok || payload?.ok === false) {
      throw new Error(payload?.statusMessage || payload?.message || 'Не удалось отправить в Telegram')
    }
    queueMessage.value = 'Карточка с кнопками отправлена в TG manager/moderation чаты'
  } catch (error: any) {
    queueMessage.value = error?.data?.statusMessage || error?.message || 'Ошибка отправки в Telegram'
  }
}

async function saveQueueEdit(submissionId: string) {
  if (!selectedCitySlug.value) return
  queueMessage.value = ''
  const edit = queueEdits[submissionId]
  if (!edit) return
  try {
    const res = await dashboardFetch(`/api/dashboard/manager/cities/${selectedCitySlug.value}/content-queue/${submissionId}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: edit.title,
        descriptionShort: edit.descriptionShort,
        descriptionFull: edit.descriptionFull,
        categorySlug: edit.categorySlug,
        registrationUrl: edit.registrationUrl,
        topicTags: edit.topicTags,
      }),
    })
    const payload = await res.json() as any
    if (!res.ok || payload?.ok === false) throw new Error(payload?.statusMessage || payload?.message || 'Save failed')
    queueMessage.value = 'Изменения сохранены'
    await loadQueue()
  } catch (error: any) {
    queueMessage.value = error?.data?.statusMessage || error?.message || 'Не удалось сохранить правки'
  }
}

async function runDigestGeneration() {
  if (!selectedCitySlug.value) return
  digestLoading.value = true
  digestMessage.value = ''
  try {
    const topicTags = Array.isArray(digestForm.topicTags)
      ? digestForm.topicTags.map((tag: string) => String(tag || '').trim()).filter(Boolean)
      : []
    const res = await dashboardFetch(`/api/dashboard/manager/cities/${selectedCitySlug.value}/generate-digest`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        mode: digestForm.mode,
        tagsMode: digestForm.tagsMode,
        limit: digestForm.limit,
        minScore: digestForm.minScore,
        categorySlug: digestForm.categorySlug || null,
        topicTags,
      }),
    })
    const payload = await res.json() as any
    if (!res.ok || payload?.ok === false) {
      throw new Error(payload?.statusMessage || payload?.message || 'Не удалось запустить генерацию')
    }
    const listCount = Array.isArray(payload?.lists) ? payload.lists.length : 0
    digestMessage.value = `Готово: создано/обновлено ${listCount} подборок`
    digestResultText.value = pretty(payload)
  } catch (error: any) {
    digestMessage.value = error?.data?.statusMessage || error?.message || 'Ошибка запуска генерации'
    digestResultText.value = pretty(error?.data || error?.message || error)
  } finally {
    digestLoading.value = false
  }
}

watch(selectedCitySlug, () => {
  cancelEditorialForm()
  void loadSettings()
  void loadQueue()
  void loadEditorialPosts()
})

onMounted(async () => {
  await loadManagerCities()
  if (selectedCitySlug.value) {
    await loadSettings()
    await loadQueue()
    await loadEditorialPosts()
  }
})
</script>
