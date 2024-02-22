#include "RNOH/Package.h"
#include "PermissionsTurboModule.h"

using namespace rnoh;
using namespace facebook;
class NativePermissionsFactoryDelegate : public TurboModuleFactoryDelegate {
public:
    SharedTurboModule createTurboModule(Context ctx, const std::string &name) const override {
        if (name == "RNPermissionsModule") {
            return std::make_shared<RTNPermissionsTurboModule>(ctx, name);
        }
        return nullptr;
    }
};

namespace rnoh {
    class PermissionsPackage : public Package {
    public:
        PermissionsPackage(Package::Context ctx) : Package(ctx) {}
        std::unique_ptr<TurboModuleFactoryDelegate> createTurboModuleFactoryDelegate() override {
            return std::make_unique<NativePermissionsFactoryDelegate>();
        }
    };
} // namespace rnoh
