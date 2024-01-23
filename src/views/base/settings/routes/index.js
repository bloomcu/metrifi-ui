import Settings from '@/views/base/settings/Settings.vue'
import SettingsBilling from '@/views/base/settings/SettingsBilling.vue'
import SettingsOrganization from '@/views/base/settings/SettingsOrganization.vue'
import SettingsUsers from '@/views/base/settings/SettingsUsers.vue'

export default [
  {
    path: "/:organization/settings",
    name: "settings",
    redirect: { name: 'settingsUsers' },
    component: Settings,
    children: [
      {
        path: "users",
        name: "settingsUsers",
        component: SettingsUsers,
      },
      {
        path: "organization",
        name: "settingsOrganization",
        component: SettingsOrganization,
      },
      {
        path: "billing",
        name: "settingsBilling",
        component: SettingsBilling,
      },
    ]
  }
]
