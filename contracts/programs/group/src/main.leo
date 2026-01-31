// AnoneX Group Module
// Private group/channel management with ZK membership proofs
// Group content is encrypted and only accessible to members

program anonex_group.aleo {
    // Group metadata
    struct GroupMetadata {
        group_id: field,
        name_hash: field,         // Hash of group name
        creator_hash: field,      // Hash of creator address
        created_at: u64,
        member_count: u64,
        is_active: bool
    }

    // Private record for group ownership
    record GroupOwnership {
        owner: address,
        group_id: field,
        encryption_key: field,    // Symmetric key for group content
        created_at: u64
    }

    // Private record for group membership
    record GroupMembership {
        owner: address,
        group_id: field,
        encryption_key: field,    // Key to decrypt group content
        joined_at: u64
    }

    // Private record for group post
    record GroupPost {
        owner: address,
        group_id: field,
        post_id: field,
        content_cid: field,       // Encrypted content on IPFS
        timestamp: u64
    }

    // Public mapping: group_id => GroupMetadata
    mapping groups: field => GroupMetadata;

    // Mapping: group_id => member count
    mapping group_members: field => u64;

    // Mapping: group_id => post count
    mapping group_posts: field => u64;

    // Hash an address
    inline hash_address(addr: address) -> field {
        return BHP256::hash_to_field(addr);
    }

    // Generate unique group ID
    inline generate_group_id(creator: address, name_hash: field, nonce: field) -> field {
        let creator_field: field = hash_address(creator);
        return BHP256::hash_to_field(creator_field + name_hash + nonce);
    }

    // Generate encryption key for group
    inline generate_encryption_key(group_id: field, creator: address, secret: field) -> field {
        let combined: field = group_id + hash_address(creator) + secret;
        return BHP256::hash_to_field(combined);
    }

    // Create a new private group
    async transition create_group(
        name_hash: field,
        nonce: field,
        secret: field,
        timestamp: u64
    ) -> (GroupOwnership, GroupMembership, Future) {
        // Generate group ID
        let group_id: field = generate_group_id(self.caller, name_hash, nonce);
        
        // Generate encryption key
        let encryption_key: field = generate_encryption_key(group_id, self.caller, secret);

        // Create ownership record
        let ownership: GroupOwnership = GroupOwnership {
            owner: self.caller,
            group_id: group_id,
            encryption_key: encryption_key,
            created_at: timestamp
        };

        // Creator is also a member
        let membership: GroupMembership = GroupMembership {
            owner: self.caller,
            group_id: group_id,
            encryption_key: encryption_key,
            joined_at: timestamp
        };

        // Hash creator
        let creator_hash: field = hash_address(self.caller);

        // Finalize on-chain
        let f: Future = finalize_create_group(group_id, name_hash, creator_hash, timestamp);

        return (ownership, membership, f);
    }

    async function finalize_create_group(
        group_id: field,
        name_hash: field,
        creator_hash: field,
        timestamp: u64
    ) {
        // Create group metadata
        let metadata: GroupMetadata = GroupMetadata {
            group_id: group_id,
            name_hash: name_hash,
            creator_hash: creator_hash,
            created_at: timestamp,
            member_count: 1u64,
            is_active: true
        };

        // Store group
        Mapping::set(groups, group_id, metadata);
        Mapping::set(group_members, group_id, 1u64);
        Mapping::set(group_posts, group_id, 0u64);
    }

    // Add a member to the group (requires ownership)
    transition add_member(
        ownership: GroupOwnership,
        new_member: address,
        timestamp: u64
    ) -> (GroupOwnership, GroupMembership, Future) {
        // Verify ownership
        assert_eq(ownership.owner, self.caller);

        // Return ownership back to owner
        let updated_ownership: GroupOwnership = GroupOwnership {
            owner: self.caller,
            group_id: ownership.group_id,
            encryption_key: ownership.encryption_key,
            created_at: ownership.created_at
        };

        // Create membership for new member
        let membership: GroupMembership = GroupMembership {
            owner: new_member,
            group_id: ownership.group_id,
            encryption_key: ownership.encryption_key,
            joined_at: timestamp
        };

        // Finalize
        let f: Future = finalize_add_member(ownership.group_id);

        return (updated_ownership, membership, f);
    }

    async function finalize_add_member(group_id: field) {
        // Increment member count
        let current_count: u64 = Mapping::get_or_use(group_members, group_id, 0u64);
        Mapping::set(group_members, group_id, current_count + 1u64);

        // Update group metadata
        let existing: GroupMetadata = Mapping::get(groups, group_id);
        let updated: GroupMetadata = GroupMetadata {
            group_id: existing.group_id,
            name_hash: existing.name_hash,
            creator_hash: existing.creator_hash,
            created_at: existing.created_at,
            member_count: current_count + 1u64,
            is_active: existing.is_active
        };
        Mapping::set(groups, group_id, updated);
    }

    // Post in a group (requires membership)
    async transition post_in_group(
        membership: GroupMembership,
        content_cid: field,
        nonce: field,
        timestamp: u64
    ) -> (GroupMembership, GroupPost, Future) {
        // Verify membership
        assert_eq(membership.owner, self.caller);

        // Generate post ID
        let author_hash: field = hash_address(self.caller);
        let post_id: field = BHP256::hash_to_field(membership.group_id + author_hash + nonce);

        // Return membership
        let updated_membership: GroupMembership = GroupMembership {
            owner: self.caller,
            group_id: membership.group_id,
            encryption_key: membership.encryption_key,
            joined_at: membership.joined_at
        };

        // Create post record
        let post: GroupPost = GroupPost {
            owner: self.caller,
            group_id: membership.group_id,
            post_id: post_id,
            content_cid: content_cid,
            timestamp: timestamp
        };

        // Finalize
        let f: Future = finalize_post_in_group(membership.group_id);

        return (updated_membership, post, f);
    }

    async function finalize_post_in_group(group_id: field) {
        // Increment post count
        let current_posts: u64 = Mapping::get_or_use(group_posts, group_id, 0u64);
        Mapping::set(group_posts, group_id, current_posts + 1u64);
    }

    // Leave a group (consumes membership)
    async transition leave_group(membership: GroupMembership) -> Future {
        // Verify membership
        assert_eq(membership.owner, self.caller);

        // Finalize
        return finalize_leave_group(membership.group_id);
    }

    async function finalize_leave_group(group_id: field) {
        // Decrement member count
        let current_count: u64 = Mapping::get_or_use(group_members, group_id, 0u64);
        if current_count > 0u64 {
            Mapping::set(group_members, group_id, current_count - 1u64);
        }

        // Update group metadata
        let existing: GroupMetadata = Mapping::get(groups, group_id);
        let new_count: u64 = current_count - 1u64;
        let updated: GroupMetadata = GroupMetadata {
            group_id: existing.group_id,
            name_hash: existing.name_hash,
            creator_hash: existing.creator_hash,
            created_at: existing.created_at,
            member_count: new_count,
            is_active: existing.is_active
        };
        Mapping::set(groups, group_id, updated);
    }
}
