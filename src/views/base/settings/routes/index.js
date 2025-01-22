import Settings from '@/views/base/settings/Settings.vue'
import SettingsBilling from '@/views/base/settings/SettingsBilling.vue'
import SettingsOrganization from '@/views/base/settings/SettingsOrganization.vue'
import SettingsSharing from '@/views/base/settings/SettingsSharing.vue'
import SettingsUsers from '@/views/base/settings/SettingsUsers.vue'
import SettingsNotifications from '@/views/base/settings/SettingsNotifications.vue'

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
        path: "sharing",
        name: "settingsSharing",
        component: SettingsSharing,
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
      {
        path: "notifications",
        name: "settingsNotifications",
        component: SettingsNotifications,
      },
    ]
  }
]
