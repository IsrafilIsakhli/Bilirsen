import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '../../components/studio';
import { PageHeader } from '../../components/page-header';
import { AccountContent, accountTitles } from './account-content';
import type { AccountView } from './account-content';

function accountView(value: unknown): AccountView {
  return value === 'register' ||
    value === 'recovery' ||
    value === 'verification' ||
    value === 'conversion'
    ? value
    : 'login';
}
export default function AccountScreen() {
  const params = useLocalSearchParams<{ view?: string }>();
  const view = accountView(params.view);
  return (
    <Screen keyboard atmosphere="quiet">
      <PageHeader title={accountTitles[view]} />
      <AccountContent
        key={view}
        view={view}
        onNavigate={(next) => router.setParams({ view: next })}
      />
    </Screen>
  );
}
