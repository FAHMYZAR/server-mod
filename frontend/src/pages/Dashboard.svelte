<script>
  import { api } from "../lib/api.js";
  import { session, notify } from "../lib/session.js";
  import { roleName, money, relativeTime } from "../lib/format.js";
  let data = $state(null);
  let loading = $state(true);
  $effect(() => {
    api
      .dashboard()
      .then((value) => {
        data = value;
        if (value.user) session.set({ loading: false, user: value.user });
      })
      .catch((e) => notify(e.message, "danger"))
      .finally(() => (loading = false));
  });
</script>

{#if loading}<div class="loading">Loading dashboard…</div>{:else}<div
    class="row"
  >
    <div class="col-lg-8">
      <div class="card mb-3">
        <div class="card-header bg-dark text-white">Registration History</div>
        <div class="card-body table-responsive">
          <table class="table table-sm table-bordered table-hover text-center">
            <tbody>
              {#each data?.history || [] as item}<tr
                  ><td
                    ><span class="badge text-dark"
                      >#{item.display_id ||
                        `3812${item.id_history || item.id}`}</span
                    ></td
                  ><td>{item.game || item.info?.split("|")[0]}</td><td
                    >{item.key_prefix || item.info?.split("|")[1]}**</td
                  ><td>{item.duration || item.info?.split("|")[2]} Days</td><td
                    class="text-primary"
                    >{item.max_devices || item.info?.split("|")[3]} Devices</td
                  ><td class="text-muted"
                    ><i>{relativeTime(item.created_at)}</i></td
                  ></tr
                >{:else}<tr><td>No registration history.</td></tr>{/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="col-lg-4">
      <div class="card mb-3">
        <div class="card-header text-center bg-dark text-white">
          Information
        </div>
        <div class="card-body">
          <ul class="list-group">
            <li>
              Roles <span
                >{roleName($session.user?.level || $session.user?.role)}</span
              >
            </li>
            <li>
              Balance <span
                >{money($session.user?.saldo ?? $session.user?.balance)}</span
              >
            </li>
            <li>Login Time <span>{relativeTime(data?.login_at)}</span></li>
            <li>Auto Logout <span>{relativeTime(data?.expires_at)}</span></li>
          </ul>
        </div>
      </div>
    </div>
  </div>{/if}
