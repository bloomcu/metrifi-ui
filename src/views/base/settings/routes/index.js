import Settings from '@/views/base/settings/Settings.vue'
import SettingsBilling from '@/views/base/settings/SettingsBilling.vue'
import SettingsOrganization from '@/views/base/settings/SettingsOrganization.vue'
import SettingsUsers from '@/views/base/settings/SettingsUsers.vue'

export default [
  {
    path: "/:organization/settings",
    name: "settings",
    redirect: { name: 'settingsOrganization' },
    component: Settings,
    children: [
      {
        path: "billing",
        name: "settingsBilling",
        component: SettingsBilling,
      },
      {
        path: "organization",
        name: "settingsOrganization",
        component: SettingsOrganization,
      },
      {
        path: "users",
        name: "settingsUsers",
        component: SettingsUsers,
      },
    ]
  }

  // {
  //   path: "/:organization/settings",
  //   // redirect: { name: 'settingsOrganization' },
  //   component: { render: () => h(RouterView) },
  //   children: [
  //     {
  //       path: "billing",
  //       name: "settingsBilling",
  //       component: SettingsBilling,
  //     },
  //     {
  //       path: "organization",
  //       name: "settingsOrganization",
  //       component: SettingsOrganization,
  //     },
  //     {
  //       path: "users",
  //       name: "settingsUsers",
  //       component: SettingsUsers,
  //     },
  //   ]
  // }

  // {
  //   path: "/:organization/settings/billing",
  //   name: "settingsBilling",
  //   component: SettingsBilling,
  // },
  // {
  //   path: "/:organization/settings/organization",
  //   name: "settingsOrganization",
  //   component: SettingsOrganization,
  // },
  // {
  //   path: "/:organization/settings/users",
  //   name: "settingsUsers",
  //   component: SettingsUsers,
  // },
]
